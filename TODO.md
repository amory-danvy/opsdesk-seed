# TODO — Feature reply-suggestion (J3)

Généré depuis `plans/reply-endpoint.md`, coché au fil de l'exécution.

- [x] Refactorer `src/server.ts` en `buildApp(database?)` + garde `isMain`
- [x] Ajouter `suggestReply(category)` (déterministe)
- [x] Déclarer la route `GET /tickets/:id/reply-suggestion` (200 / 404)
- [x] Écrire `test/reply-endpoint.test.ts` (cas 200 + 404)
- [x] `npm test` vert (13 tests)
- [ ] Relecture humaine du plan tracée (à faire par Amory)
