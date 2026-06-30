# Grille de diagnostic « agentic-ready » — OpsDesk

> Diagnostic du fil rouge **OpsDesk** (parcours P3 « Architecte agentique », Lab J1.3).
> 6 dimensions notées **0 / 1 / 2**, score total **/12**. Sert de **mètre** : la
> progression J1→J5 se mesure par la remontée de ce score. Chaque note s'adosse à une
> **preuve du repo** (chemin de fichier, sortie de commande). La note finale est
> **décidée par l'humain** (l'agent propose, l'ingénieur dispose).
>
> **Échelle distincte** de la grille d'évaluation des compétences de l'apprenant
> (5 critères × 1-5). Ici on note l'**état du repo**.

---

## En-tête

| Champ | Valeur |
|-------|--------|
| Dépôt diagnostiqué | `opsdesk/` (fork de travail, **jamais** le seed) |
| Branche / état | `etat/j1-fin` (mesuré aussi à l'arrivée sur `main`/seed) |
| Auteur du diagnostic | Amory |
| **Date** | `2026-06-30` |
| **Score total (fin J1)** | **7 / 12** |

### Passages datés (progression)

| Passage | Date | Score /12 | Lecture |
|---------|------|:---------:|---------|
| Score d'entrée (seed `main`) | 2026-06-29 | **1 / 12** | Non-agentic (l'agent travaille à l'aveugle) |
| Score fin J1 (`etat/j1-fin`)  | 2026-06-30 | **7 / 12** | En transition (fondations posées : mémoire, conventions) |

---

## Grille des 6 dimensions (note 0 / 1 / 2)

| # | Dimension | Question | 0 — non-agentic | 1 — partiel | 2 — agentic-ready |
|---|-----------|----------|-----------------|-------------|-------------------|
| 1 | **Mémoire projet** (contexte / `CLAUDE.md`) | L'agent connaît-il le projet et ses conventions sans qu'on les répète ? | Pas de `CLAUDE.md` / `AGENTS.md` | Mémoire amorcée mais incomplète / non relue | `CLAUDE.md` écrit, relu par l'humain, à jour |
| 2 | **Cibles vérifiables** (tests / CI) | Existe-t-il un « ça marche » testable et automatisé ? | Tests absents/partiels, pas de CI | `npm test` partiel **ou** CI absente | `npm test` vert + CI GitHub Actions verte, cible claire |
| 3 | **Conventions explicites** | Le style et les règles sont-ils écrits, pas seulement « dans la tête » ? | Implicites dans le code | Partiellement documentées | Documentées (README, lint/format, schémas) |
| 4 | **Observabilité** | Voit-on ce que fait l'agent (plans, traces, état) ? | Boîte noire | Traces partielles | État-en-fichiers (plans, `TODO.md`), traces exploitables |
| 5 | **Gouvernance** (relecture humaine / secrets) | Y a-t-il des garde-fous, une relecture tracée, une gestion des secrets ? | Aucun garde-fou ; **secret en clair** (`opsdesk_live_…` dans `src/config.ts`) | Relecture occasionnelle ; secret repéré non traité | Relecture systématique tracée ; **aucun secret en clair** (hook de gouvernance) |
| 6 | **Capitalisation** (prompts / commandes réutilisables) | Réutilise-t-on prompts, slash-commands et règles d'une session à l'autre ? | Repart de zéro à chaque fois | Quelques bouts capitalisés | Bibliothèque de prompts/commandes versionnée et réutilisée |

### Fiche de notation — Score d'entrée (seed `main`, 2026-06-29)

| # | Dimension | Note (0/1/2) | Justification (1 ligne) + preuve (fichier / commande) |
|---|-----------|:------------:|--------------------------------------------------------|
| 1 | Mémoire projet | `0` | Aucun `CLAUDE.md` / `AGENTS.md` à la racine du seed. |
| 2 | Cibles vérifiables (tests / CI) | `1` | `npm test` = 4 verts mais couverture partielle (data-layer seul) ; CI `ci.yml` présente ; cible « ça marche » non documentée. |
| 3 | Conventions explicites | `0` | ESM `.js`, injection de dépendance, schéma : seulement lisibles dans le code, non écrits. |
| 4 | Observabilité | `0` | Boîte noire : aucun plan-en-fichier, `TODO.md`, ni journal d'exécution. |
| 5 | Gouvernance (relecture / secrets) | `0` | Secret en clair `opsdesk_live_DEMOkeyNOTREAL0000` (`src/config.ts:3`) ; aucun garde-fou ni relecture tracée. |
| 6 | Capitalisation | `0` | Aucun `.claude/` (skills/slash-commands), aucune bibliothèque de prompts versionnée. |
| | **TOTAL** | **`1` / 12** | Non-agentic — état typique du seed. |

### Fiche de notation — Score fin J1 (`etat/j1-fin`, 2026-06-30)

| # | Dimension | Note (0/1/2) | Justification (1 ligne) + preuve (fichier / commande) |
|---|-----------|:------------:|--------------------------------------------------------|
| 1 | Mémoire projet | `2` | `CLAUDE.md` écrit **puis relu/corrigé** : 2 commits (brouillon `1c71da3` → version corrigée), conventions + section « Critères de réussite » à jour. |
| 2 | Cibles vérifiables (tests / CI) | `1` | `npm run build` vert + `npm test` = **4/4 verts** + CI `ci.yml` ; mais couverture partielle (pas de tests de routes HTTP ni cas 400/404). J1 ne modifie pas le code du seed (invariant). |
| 3 | Conventions explicites | `2` | Documentées dans `CLAUDE.md` §(c) : ESM (imports `.js`), injection de dépendance, schéma `tickets`, nommage FR/EN. |
| 4 | Observabilité | `1` | `notes-j1.md` = journal d'exécution de la session J1 (traces partielles) ; pas encore de plans-en-fichiers / `TODO.md`. |
| 5 | Gouvernance (relecture / secrets) | `1` | Secret **repéré et documenté comme risque, non corrigé** (invariant J1, traité en J2) ; relecture humaine du `CLAUDE.md` **tracée** par les 2 commits. |
| 6 | Capitalisation | `0` | Toujours aucune bibliothèque de prompts/commandes versionnée ni `.claude/` (cible des modules 2 / 4). |
| | **TOTAL** | **`7` / 12** | En transition — fondations posées. |

---

## Lecture du score (indicative)

| Score /12 | Lecture |
|-----------|---------|
| 0–3 | **Non-agentic** : l'agent travaille à l'aveugle (état du seed OpsDesk : 1/12). |
| 4–7 | **En transition** : premières fondations posées (mémoire, cibles), reste à instrumenter et gouverner. **← fin J1 : 7/12.** |
| 8–10 | **Agentic-ready** : autonome et observable ; consolider gouvernance et capitalisation. |
| 11–12 | **Mature** : autonome, observable, gouverné et capitalisé de bout en bout. |

---

## Prochaines marges de progrès (où le score remonte ensuite)

- **Cibles vérifiables (1→2)** : élargir la couverture de tests (routes HTTP, cas d'erreur 400/404) pour une cible « ça marche » complète.
- **Gouvernance (1→2)** : traiter le secret en clair via un **hook de gouvernance** (module 2) → plus aucun secret en clair.
- **Observabilité (1→2)** : plans-en-fichiers / `TODO.md`, journal d'exécution exploitable (module 3).
- **Capitalisation (0→)** : bibliothèque de prompts / slash-commands versionnée, serveur MCP, agents spécialisés (modules 2 et 4).
