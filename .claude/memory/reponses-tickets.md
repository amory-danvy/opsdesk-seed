# Mémoire — Réponses & traitement des tickets OpsDesk

Conventions récurrentes pour traiter un ticket (à réutiliser sans tout réexpliquer).

## Catégories & priorités
- Catégories valides (énumération fermée) : `acces`, `facturation`, `bug`, `demande`, `autre`.
- Priorité : entier 1 (basse) → 3 (haute). Urgent / bloquant / impossible → 3.
- Toute classification produite par un agent passe par `parseClassification()` avant usage.

## Ton des réponses client
- Français, professionnel, empathique, concis (≤ 8 lignes).
- Ne jamais promettre de délai, montant ou remboursement non confirmé.
- **Relecture humaine obligatoire avant envoi** (cf. `/rediger-reponse`).

## Tâches récurrentes
- Classer un ticket → `/classer-ticket <texte>` (sortie JSON conforme au schéma).
- Rédiger une réponse → `/rediger-reponse <id_ou_texte>`.
- Résumer les tickets ouverts → `/resumer-tickets`.
- Classer en lot → `npx tsx scripts/classify-batch.ts` (idempotent, reprise sûre).
