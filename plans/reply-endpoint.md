# Plan — endpoint GET /tickets/:id/reply-suggestion

**Objectif** : exposer une route qui renvoie un brouillon de réponse suggéré pour
un ticket donné, ou 404 si le ticket n'existe pas.

## Étapes
1. Refactorer `src/server.ts` : extraire `buildApp(database?)` (testable via `inject`),
   ne `listen()` que lorsqu'exécuté directement (`npm run dev`).
2. Ajouter la fonction déterministe `suggestReply(category)` (un message par catégorie).
3. Déclarer la route `GET /tickets/:id/reply-suggestion` à côté de `/tickets/:id` :
   - 404 `{ error: "ticket not found" }` si l'id est inconnu ;
   - sinon `{ id, category, suggestion, review_required: true }`.
4. Écrire `test/reply-endpoint.test.ts` (cas 200 + cas 404) via `buildApp(dbMémoire)`.
5. `npm test` vert.

## Fichiers touchés
- `src/server.ts` (refactor + nouvelle route)
- `test/reply-endpoint.test.ts` (nouveau)

## Tests à écrire
- 200 : ticket existant → suggestion non vide + `review_required: true`.
- 404 : ticket inconnu → `{ error: "ticket not found" }`.

## Risques
- Démarrage involontaire du serveur à l'import → mitigé par le garde `isMain`.
- Réponse envoyée sans relecture → champ `review_required: true` + convention `/rediger-reponse`.

---

## Relecture humaine

> 🔲 **Relu le AAAA-MM-JJ par Amory.** Trace ta décision ici :
> soit une correction apportée (étape/risque/fichier), soit
> « relu, aucune correction nécessaire car le plan couvre les cas 200/404 et le
> risque de démarrage involontaire ».
>
> *(Section laissée à ta main : la compétence visée est la relecture critique,
> pas une correction artificielle.)*
