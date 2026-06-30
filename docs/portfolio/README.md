# Portfolio P3 — OpsDesk (Architecte agentique)

Dossier de preuves du parcours. OpsDesk, rendu progressivement « agentic-ready »,
de l'autonomie de base (J1) à la mise en production gouvernée (J5).

## Index des 5 livrables

| Jalon | Thème | Preuves clés |
|-------|-------|--------------|
| **J1** | Fondations agentiques | [CLAUDE.md](../../CLAUDE.md), [AGENTIC-READINESS.md](../../AGENTIC-READINESS.md) (1/12 → 7/12), [notes-j1.md](../../notes-j1.md) |
| **J2** | Prompt & sortie structurée | [prompts/](../../prompts), [src/classification/](../../src/classification), hook [guard-commit.sh](../../scripts/guard-commit.sh) + [preuve](../preuves/j2-hook-blocage.txt) |
| **J3** | Contexte, mémoire & fiabilité | [.claude/memory/](../../.claude/memory), [plans/](../../plans) + [journal/](../../journal), idempotence [classify-batch.ts](../../scripts/classify-batch.ts) |
| **J4** | Outils, MCP & orchestration | [tools/](../../tools), [mcp/tickets-server.mjs](../../mcp/tickets-server.mjs), [agents](../../.claude/agents), [arbitrage](../J4-arbitrage-orchestration.md) |
| **J5** | Production & portfolio | [workflow CI](../../.github/workflows/revue-agentique.yml), [ADR-001](../decisions/adr-001-mise-en-prod.md), ce portfolio |

Démo rejouable : [demo.md](demo.md) · Garde-fous : [checklist-gardefous.md](checklist-gardefous.md)

## Grille d'auto-évaluation (5 critères × 1-5)

> ✍️ **Notes à finaliser par Amory à froid** (l'auto-évaluation officielle se fait
> dans le Dashboard). Preuves fournies ci-dessous pour t'appuyer ; la note reste la tienne.

| Critère | Note (1-5) | Preuve à l'appui |
|---------|:----------:|------------------|
| Compréhension du sujet | 🔲 | QCM 8/8 par module ; arbitrages écrits (ADR-001, note J4) |
| Qualité du code | 🔲 | DI, ESM `.js`, requêtes paramétrées, build vert |
| Tests | 🔲 | suite Vitest verte (parse, idempotence, endpoints, verdict) |
| Documentation | 🔲 | `CLAUDE.md` enrichi J1→J4, mémoire `.claude/memory/`, journaux |
| Démarche DevOps | 🔲 | hook, CI de revue idempotente, ADR, checklist garde-fous |

## Question rituelle (finale)

> ✍️ **À écrire à la main par Amory** (bilan personnel — l'agent ne le rédige pas).
> « Qu'ai-je délégué / enseigné à mes agents tout au long de ce parcours, et
> comment l'ai-je vérifié ? »

🔲
