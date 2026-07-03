# Checklist garde-fous de production — OpsDesk

| Garde-fou | En place ? | Preuve |
|-----------|:----------:|--------|
| Secrets jamais en clair (hook déterministe) | ✅ | `scripts/guard-commit.sh`, `docs/preuves/j2-hook-blocage.txt` |
| Sortie d'agent validée par schéma (rejet, pas réparation) | ✅ | `src/classification/schema.ts`, `parse.test.ts` |
| Accès base par outils MCP intentionnels (zéro SQL libre) | ✅ | `mcp/tickets-server.mjs` |
| Agent ne merge jamais (branch protection + approbation) | 🔲 GitHub | Settings → Branches (à activer sur le fork) |
| `ANTHROPIC_API_KEY` en Actions secrets, jamais commitée | 🔲 GitHub | Settings → Secrets and variables → Actions |
| Revue agentique idempotente (un seul commentaire / PR) | ✅ | marqueur `<!-- opsdesk-revue-agent -->`, `publier-verdict.test.mjs` |
| Court-circuit coût (diff tout-docs → revue sautée) | ✅ | `.github/workflows/revue-agentique.yml` |
| Tests verts exigés avant merge (verdict ≠ tests) | ✅ | CI `npm test`, ADR-001 |
| Plans/relectures tracés (observabilité) | ✅ | `plans/`, `reviews/`, `journal/` |

> 🔲 = action côté **GitHub** (réglages du dépôt), à réaliser par l'apprenant lors
> de la mise en production réelle sur son fork.
