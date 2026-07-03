# Portfolio J2 — Prompts & sorties structurées

## Chaîne complète démontrée (Lab 5)

Ticket inédit : « On m'a facturé deux fois l'abonnement de mai, merci de corriger. »

1. `/classer-ticket` → JSON :
   ```json
   {"categorie":"facturation","priorite":2,"besoin_humain":false,"confiance":0.82,"justification":"Double facturation de l abonnement de mai"}
   ```
2. Validation programmatique :
   `npx tsx scripts/valider-classification.ts '<JSON>'` → **Validation OK**.
3. `/rediger-reponse` → brouillon de réponse client (ton professionnel, ≤ 8 lignes).
4. Relecture humaine du brouillon.

| Étape | Artefact | Relu / validé le |
|-------|----------|------------------|
| Classification | JSON conforme au schéma | 🔲 (à cocher après ta relecture) |
| Réponse client | brouillon `/rediger-reponse` | 🔲 **relu / validé le AAAA-MM-JJ** |

## Garde-fous en place

- Schéma Zod source de vérité (`src/classification/schema.ts`) ; toute sortie non conforme rejetée par `parseClassification()`.
- Hook `PreToolUse` déterministe bloquant les secrets (`scripts/guard-commit.sh`) — preuve : `docs/preuves/j2-hook-blocage.txt`.
- `/rediger-reponse` impose « relecture humaine avant envoi ».

## Question rituelle

> ✍️ **À écrire à la main par Amory** (bilan personnel — l'agent ne le rédige pas).
> « Qu'ai-je délégué / enseigné à mes agents aujourd'hui, et comment l'ai-je vérifié ? » (≈ 5 lignes)

🔲
