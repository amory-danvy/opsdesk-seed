import Database from "better-sqlite3";
import { beforeEach, describe, expect, it } from "vitest";
import { classifyBatch } from "../scripts/classify-batch.js";
import type { Classification } from "../src/classification/schema.js";

// Base en mémoire avec des tickets NON classés (category IS NULL).
function makeDb() {
  const db = new Database(":memory:");
  db.exec(`
    CREATE TABLE tickets (
      id INTEGER PRIMARY KEY, subject TEXT, body TEXT, category TEXT,
      priority INTEGER, status TEXT, created_at TEXT, needs_review INTEGER DEFAULT 0
    );
  `);
  const ins = db.prepare(
    "INSERT INTO tickets (id, subject, body, category, status) VALUES (?, ?, ?, NULL, 'open')",
  );
  ins.run(1, "Cannot log in", "403 error after update");
  ins.run(2, "Double charge", "billed twice for May subscription");
  ins.run(3, "Vague", "hello"); // confiance basse → needs_review
  return db;
}

// classify déterministe et mocké : le test prouve la LOGIQUE SQL (idempotence),
// pas la stabilité d'un LLM.
const mockClassify = (t: { body: string }): Classification => {
  if (/403|log in/i.test(t.body))
    return { categorie: "acces", priorite: 3, besoin_humain: false, confiance: 0.9, justification: "x" };
  if (/charge|subscription/i.test(t.body))
    return { categorie: "facturation", priorite: 2, besoin_humain: false, confiance: 0.8, justification: "x" };
  return { categorie: "autre", priorite: 1, besoin_humain: true, confiance: 0.4, justification: "x" };
};

describe("classifyBatch — idempotence", () => {
  let db: Database.Database;
  beforeEach(() => {
    db = makeDb();
  });

  it("deux passes donnent le même résultat, la 2e n'écrit rien", () => {
    const pass1 = classifyBatch({ database: db, classify: mockClassify });
    expect(pass1.processed).toBe(3);
    expect(pass1.classified).toBe(2);
    expect(pass1.flagged).toBe(1);

    const snapshot1 = db.prepare("SELECT id, category, needs_review FROM tickets ORDER BY id").all();

    const pass2 = classifyBatch({ database: db, classify: mockClassify });
    expect(pass2.processed).toBe(0); // plus rien à traiter

    const snapshot2 = db.prepare("SELECT id, category, needs_review FROM tickets ORDER BY id").all();
    expect(snapshot2).toEqual(snapshot1); // état identique
  });

  it("après crash + reprise : aucun ticket en suspens, zéro doublon", () => {
    // Crash après 1 ticket.
    expect(() => classifyBatch({ database: db, classify: mockClassify, failAt: 1 })).toThrow();
    // Reprise complète.
    classifyBatch({ database: db, classify: mockClassify });
    const enSuspens = db
      .prepare("SELECT count(*) AS n FROM tickets WHERE category IS NULL AND needs_review = 0")
      .get() as { n: number };
    expect(enSuspens.n).toBe(0);
    // Aucun doublon de catégorie écrite : chaque ticket a au plus une valeur.
    const classed = db.prepare("SELECT count(*) AS n FROM tickets WHERE category IS NOT NULL").get() as { n: number };
    expect(classed.n).toBe(2);
  });
});
