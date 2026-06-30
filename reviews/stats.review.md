# Revue — GET /tickets/stats (reviewer)

Entrée : `git diff` (route + test) + `plans/stats.plan.md`.

## Verdict : **GO** (sous réserve des points de contrôle humains)

## Conformité au plan
- [x] Route `GET /tickets/stats` ajoutée dans `src/server.ts`.
- [x] Compteurs calculés via `listTickets()` — **aucun nouveau SQL** (conforme à l'invariant).
- [x] Test `test/stats-endpoint.test.ts` présent et pertinent (jeu 2/1/1).
- [x] `npx vitest run` **vert** (17 tests) — vérifié, pas seulement affirmé.
- [x] Vérif réelle : `curl /tickets/stats` → `{"open":9,"in_progress":2,"closed":1}`.

## Objections / risques restants
1. Les statuts hors énumération (`open|in_progress|closed`) ne sont pas comptés —
   acceptable tant que la base ne contient que ces 3 valeurs ; à surveiller si le
   schéma évolue.
2. Pas de pagination/perf : `listTickets()` charge tout — non bloquant à cette échelle.

## Rappel de gouvernance
Le verdict **ne remplace pas** les tests : ils sont verts indépendamment de cet avis.
Ne pas merger sur la seule parole de l'agent → point de contrôle humain n°3 requis.

> 🔲 **Point de contrôle humain n°3 (Amory)** : décision de merge tracée le AAAA-MM-JJ.
