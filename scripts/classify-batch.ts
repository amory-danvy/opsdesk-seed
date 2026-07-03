import { appendFileSync, mkdirSync } from "node:fs";
import type BetterSqlite3 from "better-sqlite3";
import { db as defaultDb } from "../src/db.js";
import { classify as defaultClassify } from "../src/classification/classify.js";
import type { Classification } from "../src/classification/schema.js";

type DB = BetterSqlite3.Database;
type ClassifyFn = (t: { subject?: string; body: string }) => Classification;

// Garantit la présence de la colonne needs_review (migration idempotente).
export function ensureSchema(database: DB): void {
  const cols = database.prepare("PRAGMA table_info(tickets)").all() as { name: string }[];
  if (!cols.some((c) => c.name === "needs_review")) {
    database.exec("ALTER TABLE tickets ADD COLUMN needs_review INTEGER DEFAULT 0");
  }
}

type Row = { id: number; subject: string; body: string };

// Classification en lot IDEMPOTENTE :
// - ne traite que les tickets non classés et non marqués (category IS NULL AND needs_review = 0) ;
// - écrit sous condition (UPDATE ... WHERE id = ? AND category IS NULL) → rejouer ne duplique rien ;
// - marque needs_review = 1 si confiance < 0.7 (au lieu de deviner) ;
// - OPSDESK_FAIL_AT=<n> : lève après n tickets (simulation de crash, pour tester la reprise).
export function classifyBatch(opts: {
  database?: DB;
  classify?: ClassifyFn;
  failAt?: number;
  journalDir?: string;
} = {}): { processed: number; classified: number; flagged: number } {
  const database = opts.database ?? defaultDb;
  const classify = opts.classify ?? defaultClassify;
  ensureSchema(database);

  const todo = database
    .prepare("SELECT id, subject, body FROM tickets WHERE category IS NULL AND needs_review = 0 ORDER BY id")
    .all() as Row[];

  const updateCat = database.prepare(
    "UPDATE tickets SET category = ?, priority = ? WHERE id = ? AND category IS NULL",
  );
  const flag = database.prepare(
    "UPDATE tickets SET needs_review = 1 WHERE id = ? AND category IS NULL",
  );

  let processed = 0;
  let classified = 0;
  let flagged = 0;
  for (const row of todo) {
    if (opts.failAt !== undefined && processed >= opts.failAt) {
      throw new Error(`crash simulé après ${processed} tickets (OPSDESK_FAIL_AT)`);
    }
    const c = classify({ subject: row.subject, body: row.body });
    if (c.confiance < 0.7) {
      flag.run(row.id);
      flagged++;
    } else {
      updateCat.run(c.categorie, c.priorite, row.id);
      classified++;
    }
    processed++;
    if (opts.journalDir) {
      mkdirSync(opts.journalDir, { recursive: true });
      const line = `${new Date().toISOString()} ticket=${row.id} categorie=${c.categorie} confiance=${c.confiance} action=${c.confiance < 0.7 ? "needs_review" : "classed"}\n`;
      appendFileSync(`${opts.journalDir}/classify-batch.log`, line);
    }
  }
  return { processed, classified, flagged };
}

// Point d'entrée CLI : npx tsx scripts/classify-batch.ts  (OPSDESK_FAIL_AT=n pour simuler un crash)
const isMain = process.argv[1] && process.argv[1].endsWith("classify-batch.ts");
if (isMain) {
  const failAt = process.env.OPSDESK_FAIL_AT ? Number(process.env.OPSDESK_FAIL_AT) : undefined;
  try {
    const r = classifyBatch({ failAt, journalDir: "journal" });
    console.log(`OK — traités=${r.processed} classés=${r.classified} à relire=${r.flagged}`);
  } catch (err) {
    console.error("Interrompu :", (err as Error).message);
    process.exit(1);
  }
}
