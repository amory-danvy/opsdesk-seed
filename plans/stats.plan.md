# Plan — GET /tickets/stats (pipeline planner→builder→reviewer)

**Demande** : exposer `GET /tickets/stats` renvoyant `{ open, in_progress, closed }`.
**Critère** : test Vitest passant + route répond 200.

## Étapes (planner)
1. Ajouter la route `GET /tickets/stats` dans `src/server.ts`, à côté de `/tickets`.
2. Calculer les compteurs en **réutilisant `listTickets()`** (`src/tickets.ts`), sans nouveau SQL.
3. Écrire `test/stats-endpoint.test.ts` (base mémoire : 2 open, 1 in_progress, 1 closed).
4. `npx vitest run` vert ; vérifier en réel via `curl /tickets/stats`.

## Fichiers touchés
- `src/server.ts` (route)
- `test/stats-endpoint.test.ts` (nouveau)

## Tests
- 200 + corps `{ open: 2, in_progress: 1, closed: 1 }` sur le jeu de test.

## Risques
- Conflit de route `/tickets/stats` vs `/tickets/:id` → Fastify priorise le statique : OK.
- Statut inconnu non compté → acceptable (3 statuts canoniques seulement).

---

## Point de contrôle humain n°1 (relecture du plan)
> 🔲 **Décision (Amory)** : accepté / amendé / refusé, le AAAA-MM-JJ.
> (Section réservée : trace ta décision avant de lancer le builder.)
