# Carnet de bord — J1 (OpsDesk)

> Structure imposée par la Skill `carnet-de-bord` (parsée par la plateforme).
> Sections factuelles remplies par l'agent (adossées au repo) ; **Non-délégation**
> et **Question rituelle** sont réservées à l'apprenant (saisie à la main).

## Conventions implicites

Conventions réellement suivies par le code mais écrites nulle part au départ (sorties Lab 2 / Lab 3) :

- **ESM avec extension `.js` sur les imports internes**, même si la source est `.ts` — ex. `import { db } from "./db.js"` (`src/seed.ts:1`, `src/server.ts:2-3`, `src/tickets.ts:2`, `src/db.ts:4`).
- **Injection de dépendance optionnelle** : les fonctions d'accès données prennent un paramètre `database: DB = defaultDb` (défaut = base partagée) pour tester sur une base en mémoire — `src/tickets.ts:7,14,24`, utilisé par `test/tickets.test.ts`.
- **Schéma de table en anglais, valeurs de `category` en français** (`acces`, `facturation`, `bug`, `demande`, `autre`) — `src/seed.ts:8,16,32,64…`.
- **Identifiants de seed stables `1001..1012`** pour la rejouabilité des labs — `src/seed.ts:108,112`.
- **Port 3000 par défaut**, surchargeable par `process.env.PORT` — `src/config.ts:5`.

## Angles morts

Ce que le repo ne dit nulle part et qu'un agent doit deviner (≥ 2, dont le secret) :

- **Secret en clair `OPSDESK_API_KEY = "opsdesk_live_DEMOkeyNOTREAL0000"`** — `src/config.ts:3`. **Repéré et documenté comme risque, NON corrigé** (invariant J1 ; traité en J2 via un hook de gouvernance). Un agent qui « corrigerait » ce secret à chaud propagerait le motif dans l'historique git.
- **Couverture de tests partielle** : 4 tests sur la seule couche données (`test/tickets.test.ts`) ; **aucune route HTTP testée** (`GET /tickets`, `GET /tickets/:id`, `POST /tickets/:id/status`, `GET /health`), **aucun cas d'erreur** 400/404.
- **Cible de réussite non documentée à l'origine** (avant `CLAUDE.md`) : rien n'indiquait quelle commande prouve qu'une modif est correcte, ni le contrat des codes de retour des routes.
- **Pin de version Node fragile à l'usage** : `engines: >=20 <24` + `.npmrc engine-strict` bloquent `npm ci` hors plage (Node 24 échoue) — contrainte non évidente sans lire `.nvmrc` / `.npmrc`.

## Note pi.dev

- **Cœur minimal d'un agent = une boucle (observer → décider → agir → observer) + 4 outils : `Read` / `Write` / `Edit` / `Bash`.** C'est ce qu'expose Pi (`@earendil-works/pi-coding-agent`, Mario Zechner), volontairement nu, sans sous-agent intégré.
- Sous-agents, MCP, hooks, pipelines = **couches construites par-dessus** cette boucle (Claude Code les ajoute ; Pi reste minimal). Curseur « cœur nu ↔ framework équipé », pas deux camps.
- **Position anti-framework = un débat, pas un fait** : « lancer massivement des sous-agents en parallèle est un anti-pattern » est une opinion d'auteur. La vraie question : peut-on encore **observer et gouverner** ce que font les agents ? Si non, on en a trop.

> 🔲 **Lab 5 (à exécuter par toi, clé API requise)** : `npx @earendil-works/pi-coding-agent`, poser le prompt du Lab 2, puis relever ici (chiffres) : nb d'outils exposés (attendu 4), mémoire projet chargée ? (attendu non — Pi ne lit pas `CLAUDE.md`), longueur de trace + absence de sous-agent, version datée. *Pi a sa propre auth, indépendante de Claude Code — je ne manipule pas ta clé.*

## Non-délégation

> ✍️ **À écrire par toi (Amory)** — le cours et la Skill réservent cette section à l'apprenant : trois situations de **ton propre travail** où tu refuserais de laisser un agent décider seul (irréversible / secrets / non vérifiable), une ligne de justification chacune. Je ne les invente pas à ta place.

1. 🔲 _Situation 1_ — justification :
2. 🔲 _Situation 2_ — justification :
3. 🔲 _Situation 3_ — justification :

## Question rituelle

> ✍️ **À remplir À LA MAIN, sans agent** (consigne explicite de la Skill `carnet-de-bord` et du Lab 6 — c'est ton bilan personnel, gage d'authenticité de l'auto-évaluation). Réponds à :
> « Qu'ai-je délégué / enseigné à mes agents aujourd'hui, et comment l'ai-je vérifié ? »

🔲

---

## Annexe (hors structure parsée) — Lab 6 : mémoire projet, mesure avant/après

**Prompt du Lab 2 (mot pour mot)** :

> « En te basant uniquement sur ce dépôt : quelle commande dois-je lancer pour vérifier qu'une modification est correcte ? Et quelles conventions de nommage ce projet suit-il ? Si tu n'es pas sûr, dis-le explicitement. »

> ⚠️ **Reconstruction raisonnée, pas une trace headless brute.** La mesure `claude -p` automatisée a échoué (« Not logged in » : la session interactive vit dans le trousseau, inaccessible à un terminal détaché ; il faudrait exporter une clé API). Le contenu ci-dessous est **adossé aux faits vérifiables du repo** ; pour la trace brute, rejoue le prompt en interactif (`claude`) sur le commit *avant* puis *après* `CLAUDE.md`.

**AVANT (sans `CLAUDE.md`, état seed)** — ce que l'agent peut établir vs deviner :
- Trouve les scripts dans `package.json` → propose `npm run build` + `npm test` (exact).
- **Devine / omet** : que `GET /health` doit répondre `{"status":"ok"}`, le contrat 404/400 des routes, l'exigence `npm ci` (lock figé) — rien ne l'écrit.
- Conventions de nommage : **infère** ESM `.js`, schéma EN / catégories FR, mais ne peut affirmer que c'est **délibéré** (vs accidentel) ; risque de rater la règle d'injection de dépendance.

**APRÈS (avec `CLAUDE.md`)** — l'agent cite directement :
- Cible de réussite complète : build + test (4 verts) + `/health` `{"status":"ok"}` + contrat 404/400 + `npm ci` reproductible + CI verte (§ « Critères de réussite »).
- Conventions explicites : ESM `.js`, injection de dépendance `database`, schéma EN / `category` FR (§(c)).

**Devinettes / approximations qui disparaissent grâce à `CLAUDE.md` (le décompte = la preuve)** :

| # | Devinette AVANT | Levée APRÈS ? |
|---|-----------------|:-------------:|
| 1 | Cible de réussite incomplète (`/health`, contrat 404/400, `npm ci` non mentionnés) | ✅ documentée |
| 2 | ESM `.js`-sur-`.ts` : convention délibérée ou accident ? | ✅ explicite + raison |
| 3 | Injection de dépendance `database` (pour tests) souvent ratée | ✅ documentée |
| 4 | Split nommage EN (schéma) / FR (catégories) non reconnu comme convention | ✅ explicite |
| 5 | Secret en clair : bug à corriger ? | ✅ documenté comme démo factice volontaire |

**Bilan** : ~**4-5 devinettes/omissions en moins** après ajout de la mémoire projet — preuve mesurable que `CLAUDE.md` a « enseigné » le contexte vérifiable à l'agent.
