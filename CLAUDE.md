# CLAUDE.md

> Brouillon généré par l'agent à partir du dépôt (avant relecture humaine).

## (a) À quoi sert OpsDesk

OpsDesk est un mini back-office de gestion de tickets de support : une API HTTP
(Fastify), une base SQLite locale (better-sqlite3) et un jeu de données
d'exemple. Il sert de fil rouge applicatif pour la formation.

## (b) Stack et commandes clés

- TypeScript en ESM (`"type": "module"`), Node.js 20–22 LTS.
- Fastify (API HTTP), better-sqlite3 (SQLite), Vitest (tests), GitHub Actions (CI).

| Commande        | Effet                                                        |
|-----------------|-------------------------------------------------------------|
| `npm ci`        | Installe les dépendances (jamais `npm install` ; conserver `package-lock.json`). |
| `npm run seed`  | Initialise/réinitialise la base avec le jeu d'exemple (`tsx src/seed.ts`). |
| `npm run dev`   | Démarre le serveur (`tsx src/server.ts`), port 3000.        |
| `npm run build` | Compile via `tsc` vers `dist/`.                             |
| `npm test`      | Lance la suite Vitest (`vitest run`).                       |

## Structure

- `src/config.ts` — configuration (`PORT`, `DB_PATH`).
- `src/db.ts` — connexion SQLite, schéma `tickets`, type `Ticket`.
- `src/tickets.ts` — accès données (`listTickets`, `getTicket`, `updateTicketStatus`).
- `src/server.ts` — routes Fastify.
- `src/seed.ts` — jeu de données d'exemple.
- `test/tickets.test.ts` — tests unitaires (base SQLite en mémoire).

## Routes

- `GET /health` → `{ "status": "ok" }`
- `GET /tickets` → liste des tickets (ordre `created_at DESC`)
- `GET /tickets/:id` → un ticket, ou `404`
- `POST /tickets/:id/status` (corps `{ "status": "..." }`) → ticket mis à jour ;
  `400` si `status` manquant, `404` si l'id est inconnu.

## Schéma `tickets`

`id` INTEGER (PK), `subject` TEXT, `body` TEXT, `category` TEXT,
`priority` INTEGER, `status` TEXT, `created_at` TEXT.

## (c) Conventions de code déduites

- **ESM** : les imports internes portent l'extension `.js` même si la source est
  `.ts` (ex. `import { db } from "./db.js"`).
- **Injection de dépendance** : les fonctions de `src/tickets.ts` acceptent un
  paramètre `database` optionnel (défaut : la base partagée) pour permettre les
  tests sur une base en mémoire.
- Schéma de table en anglais ; valeurs de `category` en français (`acces`,
  `facturation`, `bug`, `demande`, `autre`).
- `tsconfig` : `strict` activé ; `rootDir: src` ; `test` exclu du build.
- Node 24+ non supporté (better-sqlite3 v11 sans binaire prebuild) ; `.nvmrc`
  cible Node 22 ; `engine-strict` (`.npmrc`) fait échouer `npm ci` hors plage.

## (d) Comment savoir qu'une modif est correcte

- `npm run build` compile sans erreur (exit 0).
- `npm test` passe (4 tests dans `test/tickets.test.ts`).
- `npm run dev` puis `GET /health` renvoie `{"status":"ok"}`.
- La CI (GitHub Actions) rejoue `npm ci` + `npm test` sur Node 20.
