# ADR-001 — Revue agentique : pipeline éphémère vs agent persistant

- **Statut** : accepté
- **Date** : 2026-06-30
- **Décideur** : Amory

## Contexte

OpsDesk veut une revue agentique de PR en CI/CD. Deux modèles d'exécution :

- **(A) Pipeline éphémère** : un job GitHub Actions démarre à chaque PR, exécute
  l'agent (Claude Code / SDK), publie un commentaire, puis disparaît. État porté
  par la PR et les fichiers du repo.
- **(B) Agent persistant** : un service long-vivant (type Pi en mode SDK, cf.
  OpenClaw de Peter Steinberger) écoute les événements et garde un état en mémoire.

> Désambiguïsation : **pi.dev** = Pi Coding Agent de Mario Zechner
> (`@earendil-works/pi-coding-agent`) ≠ **pi.ai** d'Inflection (assistant grand
> public). OpenClaw = Pi piloté en **mode SDK**.

## Critères (observables / chiffrables)

| Critère | (A) Pipeline éphémère | (B) Agent persistant |
|---------|-----------------------|----------------------|
| Coût au repos | nul (0 job hors PR) | continu (process always-on) |
| Surface de sécurité | clé en Actions secret, scope PR | service exposé, état en mémoire à protéger |
| Observabilité | logs Actions + commentaire idempotent | nécessite instrumentation dédiée |
| Reproductibilité | re-run d'un job = même entrée | état mémoire difficile à rejouer |

## Décision

**Option (A), pipeline éphémère**, pour OpsDesk. Deux critères décisifs : **coût
au repos nul** et **reproductibilité** (un `Re-run` rejoue exactement la même
entrée, sans état caché). L'agent **ne merge jamais** : branch protection +
approbation humaine. La production tourne sur **Claude Code** (stable, documenté) ;
pi.dev reste un objet d'étude, pas un composant du runner CI.

## Conséquences

- + Simplicité opérationnelle, coût maîtrisé, gouvernance claire.
- − Pas de mémoire inter-PR (acceptable : chaque revue est indépendante).
- Reconsidérer (B) si un besoin d'état partagé inter-PR apparaît (ex. suivi de
  dette sur plusieurs PR), avec une instrumentation d'observabilité dédiée.
