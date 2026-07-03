# CLAUDE.md

> Relu et corrigé à la main après génération (cf. commit « brouillon » précédent).

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

**Pourquoi `npm ci` et pas `npm install`** : le `package-lock.json` fige les
binaires natifs de better-sqlite3 par plateforme. `npm ci` installe directement
le bon binaire ; supprimer le lock ou faire `npm install` peut déclencher une
recompilation (qui échoue sur Windows sans outils de build).

## Structure

- `src/config.ts` — configuration (`PORT`, `DB_PATH`, clé API de démo).
- `src/db.ts` — connexion SQLite, schéma `tickets`, type `Ticket`.
- `src/tickets.ts` — accès données (`listTickets`, `getTicket`, `updateTicketStatus`).
- `src/server.ts` — routes Fastify.
- `src/seed.ts` — jeu de données d'exemple.
- `test/tickets.test.ts` — tests unitaires (base SQLite en mémoire).

## Routes

- `GET /health` → `{ "status": "ok" }`
- `GET /tickets` → liste des tickets (ordre `created_at DESC`)
- `GET /tickets/:id` → un ticket, ou `404 { "error": "ticket not found" }`
- `POST /tickets/:id/status` (corps `{ "status": "..." }`) → ticket mis à jour ;
  `400` si `status` manquant, `404` si l'id est inconnu.

## Schéma `tickets`

`id` INTEGER (PK), `subject` TEXT, `body` TEXT, `category` TEXT,
`priority` INTEGER, `status` TEXT, `created_at` TEXT.

Le `seed` utilise des identifiants stables `1001..1012` (rejouabilité des labs).

## (c) Conventions de code déduites

- **ESM** : les imports internes portent l'extension `.js` même si la source est
  `.ts` (ex. `import { db } from "./db.js"`).
- **Injection de dépendance** : les fonctions de `src/tickets.ts` acceptent un
  paramètre `database` optionnel (défaut : la base partagée) pour permettre les
  tests sur une base en mémoire — voir `test/tickets.test.ts`.
- Schéma de table en anglais ; valeurs de `category` en français (`acces`,
  `facturation`, `bug`, `demande`, `autre`).
- `tsconfig` : `strict` activé ; `rootDir: src` ; `test` exclu du build.
- Node 24+ non supporté (better-sqlite3 v11 sans binaire prebuild) ; `.nvmrc`
  cible Node 22 ; `engine-strict` (`.npmrc`) fait échouer `npm ci` hors plage.
- SQLite est en mode WAL : la base génère `*.db-wal` / `*.db-shm` (ignorés par
  `.gitignore`, comme `data/` et `dist/`).
- `src/config.ts` contient `OPSDESK_API_KEY` codée en dur. C'est une valeur de
  **démonstration** explicitement factice (`...DEMOkeyNOTREAL...`) ; ne jamais y
  mettre de vrai secret — une vraie clé passerait par une variable d'environnement.

## (d) Comment savoir qu'une modif est correcte

- `npm run build` compile sans erreur (exit 0).
- `npm test` passe (état actuel : 4 tests verts dans `test/tickets.test.ts`).
- `npm run dev` puis `GET /health` renvoie `{"status":"ok"}`.
- La CI (GitHub Actions, `.github/workflows/ci.yml`) rejoue `npm ci` + `npm test`
  sur Node 20 à chaque push / PR.

## Critères de réussite

Une contribution est considérée correcte lorsque **toutes** ces conditions sont
réunies :

1. **Build vert** — `npm run build` se termine sans erreur TypeScript.
2. **Tests verts** — `npm test` ne régresse pas (au minimum les tests existants
   passent ; une nouvelle fonctionnalité s'accompagne d'un test).
3. **Santé OK** — au démarrage, `GET /health` répond `{"status":"ok"}`.
4. **Contrat des routes respecté** — codes de retour inchangés (`404` ticket
   inconnu, `400` `status` manquant) sauf changement intentionnel et documenté.
5. **Environnement reproductible** — installation via `npm ci` sur Node 20–22,
   `package-lock.json` conservé.
6. **CI verte** — le workflow GitHub Actions passe sur la PR.

## Bibliothèque de prompts (J2)

Slash-commands disponibles dans `.claude/commands/` :
- `/classer-ticket <texte>` : classification JSON ; doit valider `src/classification/schema.ts`.
- `/rediger-reponse <id_ou_texte>` : brouillon de réponse client ; **relecture humaine avant envoi**.
- `/resumer-tickets` : synthèse des tickets ouverts (liste + compteur par catégorie).

Règle : toute classification produite par un agent doit passer dans
`parseClassification()` (`src/classification/parse.ts`) avant d'être utilisée.
Toute sortie non conforme au schéma est **rejetée**, jamais réparée à la main.
Convention de nommage des prompts : voir `prompts/README.md`.

## Gouvernance : hook anti-secret (J2)

Un hook `PreToolUse` (`.claude/settings.json` → `scripts/guard-commit.sh`) bloque
mécaniquement tout `git commit` dont le contenu stagé contient un secret
(motif `opsdesk_live_`, clés AWS, clés privées, `password=`) ou un `.env`
non-example. **La détection est déterministe (regex/scan), pas un jugement du
modèle** — le modèle peut aider à écrire la regex, c'est le script qui décide.
Limite : ne couvre que les commits passant par Claude Code. Preuve de blocage :
`docs/preuves/j2-hook-blocage.txt`.

## Carte du contexte (où vit quoi) — J3

- **Session** (volatile) : la tâche en cours, le prompt courant.
- **Mémoire projet** (persistante, versionnée) : `CLAUDE.md` + `.claude/memory/*.md`.
- **État de tâche** (semi-persistant, sur disque) : `plans/*.md`, `TODO.md`, `journal/`.

Détail du rangement des informations : `docs/contexte-rangement.md`.

## Tâches récurrentes — J3

Conventions de traitement des tickets (ton, catégories, relecture) :
`.claude/memory/reponses-tickets.md`. Pattern d'idempotence des scripts en lot :
`.claude/memory/idempotence.md`.

## Règle : planifier avant de coder — J3

Pour toute tâche multi-étapes : **écrire un plan dans `plans/<nom>.md` (objectif,
étapes, fichiers touchés, tests, risques) et le faire relire AVANT d'écrire du
code applicatif**. Générer `TODO.md` depuis le plan, journaliser chaque étape
(résultat + test vert/rouge) dans `journal/<date>.md`. Les scripts qui écrivent
en base sont **idempotents** (rejouables sans doublon, reprise après crash).

## Outils & contrats — J4

Un **outil** exposé à l'agent = **nom verbe-objet** + **description quand / quand
pas** + **schéma typé** + **erreurs en résultat** (jamais d'exception qui casse le
flux ; ex. corps vide → `{ erreur: ... }`). Référence : `tools/classifier-ticket.mjs`
(+ `tools/run-classifier.mjs`, test `tools/classifier-ticket.test.mjs`).

## Accès base via MCP — J4

Tout accès à la table `tickets` par un agent passe par le **serveur MCP** `tickets`
(`mcp/tickets-server.mjs`) : 3 outils seulement (`list_tickets`, `get_ticket`,
`update_ticket_status`), **requêtes paramétrées**, **aucun** `run_query`/`execute_sql`.
Brancher en une ligne :

```
claude mcp add tickets -- node "$(pwd)/mcp/tickets-server.mjs"
claude mcp list   # attendu : tickets ✓ connected
```

## Workflow d'orchestration — J4

`feature → planner → [valider plan] → builder → [tests verts] → reviewer → [lire
verdict] → merge`. Définitions d'agents : `.claude/agents/{planner,builder,reviewer}.md`
(et `.pi/agents/` pour la séquence pi.dev, cf. `agent-chain.yaml`). **Le verdict
d'un agent ne remplace jamais l'exécution des tests** ; chaque jonction est un
point de contrôle humain tracé.
