# Rangement du contexte — où vit quoi (J3)

Les trois horizons de contexte appliqués à OpsDesk. Chaque information se range
dans l'horizon qui correspond à sa durée de vie et à son besoin de versionnement.

| # | Information | Horizon | Où elle vit |
|---|-------------|---------|-------------|
| 1 | Le texte du ticket en cours de traitement | Session (volatile) | le prompt courant |
| 2 | Les catégories valides + conventions du projet | Mémoire projet (persistante, versionnée) | `CLAUDE.md`, `.claude/memory/*.md` |
| 3 | La cible de réussite (`build` + `test` + `/health`) | Mémoire projet | `CLAUDE.md` §Critères de réussite |
| 4 | Le plan de la feature en cours | État de tâche (semi-persistant, disque) | `plans/*.md` |
| 5 | La progression des étapes (cochées au fil de l'eau) | État de tâche | `TODO.md` |
| 6 | Le résultat daté de chaque étape (test vert/rouge) | État de tâche | `journal/<date>.md` |

> Règle : tout ce qui doit survivre à la session **et** être relu en PR va en
> mémoire projet (versionnée). Tout ce qui décrit l'avancement d'une tâche va en
> état de tâche (fichiers sur disque). Le reste est volatile.
