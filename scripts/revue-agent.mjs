// revue-agent.mjs : exécute la revue agentique en CI.
// 1) construit le diff de la PR, 2) appelle le modèle avec le prompt versionné
// (.github/agent/revue-pr.md), 3) imprime le verdict JSON brut sur stdout
// (publier-verdict.mjs le valide ensuite). N'a JAMAIS le droit de merger.
//
// Nécessite ANTHROPIC_API_KEY (Actions secret, jamais commité).
import { readFileSync } from "node:fs";
import { execSync } from "node:child_process";

const PROMPT = readFileSync(".github/agent/revue-pr.md", "utf8");

function diffDeLaPR() {
  const base = process.env.BASE_SHA || "origin/main";
  const head = process.env.HEAD_SHA || "HEAD";
  return execSync(`git diff ${base}...${head}`, { encoding: "utf8", maxBuffer: 10 * 1024 * 1024 });
}

async function demanderVerdict(diff) {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) throw new Error("ANTHROPIC_API_KEY manquante (Actions secret).");
  const { default: Anthropic } = await import("@anthropic-ai/sdk");
  const client = new Anthropic({ apiKey: key });
  const msg = await client.messages.create({
    model: "claude-opus-4-8",
    max_tokens: 1024,
    messages: [
      { role: "user", content: `${PROMPT}\n\n--- DIFF DE LA PR ---\n${diff}` },
    ],
  });
  // On renvoie le texte brut ; l'extraction/validation JSON est faite en aval.
  return msg.content.map((b) => (b.type === "text" ? b.text : "")).join("");
}

const verdict = await demanderVerdict(diffDeLaPR());
process.stdout.write(verdict);
