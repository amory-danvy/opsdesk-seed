// publier-verdict.mjs : valide le verdict JSON de l'agent, le rend en markdown,
// et publie/MET À JOUR (upsert) un commentaire de PR. Idempotent : un marqueur
// caché identifie LE commentaire de l'agent → deux pushes = un seul commentaire.
//
// Validation INTERNE (sans schéma externe) : si le JSON est invalide → throw,
// le job échoue. On ne publie JAMAIS une sortie non conforme.

export const MARQUEUR = "<!-- opsdesk-revue-agent -->";

const SEVERITES = new Set(["high", "medium", "low"]);
const VERDICTS = new Set(["approve", "request_changes", "comment"]);

export function validerVerdict(raw) {
  let v;
  try {
    v = typeof raw === "string" ? JSON.parse(raw) : raw;
  } catch {
    throw new Error("verdict: JSON invalide");
  }
  if (!v || typeof v !== "object") throw new Error("verdict: objet attendu");
  if (!VERDICTS.has(v.verdict)) throw new Error(`verdict: champ 'verdict' invalide (${v.verdict})`);
  if (typeof v.summary !== "string" || !v.summary) throw new Error("verdict: 'summary' manquant");
  if (!Array.isArray(v.findings)) throw new Error("verdict: 'findings' doit être un tableau");
  for (const f of v.findings) {
    if (!SEVERITES.has(f.severity)) throw new Error(`finding: severity invalide (${f.severity})`);
    if (typeof f.file !== "string" || typeof f.message !== "string")
      throw new Error("finding: 'file'/'message' manquant");
  }
  return v;
}

export function rendreMarkdown(v) {
  const lignes = [
    MARQUEUR,
    `## 🤖 Revue agentique OpsDesk — \`${v.verdict}\``,
    "",
    `**${v.summary}**`,
    "",
  ];
  if (v.findings.length === 0) {
    lignes.push("_Aucun problème relevé._");
  } else {
    lignes.push("| Sévérité | Fichier | Remarque |", "|----------|---------|----------|");
    for (const f of v.findings) lignes.push(`| ${f.severity} | \`${f.file}\` | ${f.message} |`);
  }
  lignes.push("", "> Verdict indicatif. Le merge reste soumis à approbation humaine + tests verts.");
  return lignes.join("\n");
}

// --- Effets de bord (publication) : isolés, exécutés seulement en CLI ---
async function publier({ octokit, owner, repo, prNumber, body }) {
  // upsert : cherche un commentaire portant le marqueur, sinon en crée un.
  const { data: comments } = await octokit.rest.issues.listComments({ owner, repo, issue_number: prNumber });
  const existant = comments.find((c) => c.body && c.body.includes(MARQUEUR));
  if (existant) {
    await octokit.rest.issues.updateComment({ owner, repo, comment_id: existant.id, body });
  } else {
    await octokit.rest.issues.createComment({ owner, repo, issue_number: prNumber, body });
  }
}

const isMain = process.argv[1] && process.argv[1].endsWith("publier-verdict.mjs");
if (isMain) {
  const raw = process.env.VERDICT_JSON ?? process.argv[2];
  const v = validerVerdict(raw); // throw → job échoue si non conforme
  const body = rendreMarkdown(v);
  if (process.env.GITHUB_TOKEN && process.env.PR_NUMBER) {
    const { Octokit } = await import("@octokit/rest");
    const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
    const [owner, repo] = (process.env.GITHUB_REPOSITORY ?? "/").split("/");
    await publier({ octokit, owner, repo, prNumber: Number(process.env.PR_NUMBER), body });
    console.log("Commentaire de revue publié/mis à jour.");
  } else {
    // mode local : pas de publication, on imprime le markdown rendu.
    console.log(body);
  }
}
