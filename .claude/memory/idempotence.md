# Mémoire — Pattern d'idempotence (scripts en lot OpsDesk)

Un script qui modifie la base doit pouvoir être **rejoué sans dupliquer** et
**reprendre après un crash** sans laisser de ticket en suspens.

## Règles (appliquées dans `scripts/classify-batch.ts`)
1. **Lire le restant à faire**, pas tout : `WHERE category IS NULL AND needs_review = 0`.
2. **Écrire sous condition** : `UPDATE ... WHERE id = ? AND category IS NULL`.
   Rejouer ne ré-écrit pas un ticket déjà traité.
3. **Marquer plutôt que deviner** : `confiance < 0.7` → `needs_review = 1`.
4. **Journaliser** chaque ticket traité (date, id, action) dans `journal/`.
5. **Reprise** : après crash (`OPSDESK_FAIL_AT=n`), relancer reprend là où ça s'est arrêté ;
   invariant vérifié : `count(category IS NULL AND needs_review = 0) = 0`, zéro doublon.

## Preuve
`test/classify-idempotent.test.ts` : deux passes = même état (2ᵉ passe écrit 0) ;
crash + reprise = aucun ticket en suspens. `classify` est **mocké** (déterministe) :
le test prouve la logique SQL, pas la stabilité d'un LLM.
