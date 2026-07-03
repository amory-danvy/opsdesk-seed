# Mesure Act → Learn → Reuse (J3, Lab 4)

> ⚠️ **Mesure à exécuter en interactif par toi** (deux sessions Claude Code, sur
> les tickets #1003 puis #1004). Le tableau ci-dessous est la **trame** + une
> reconstruction raisonnée du gain attendu, adossée aux artefacts du repo. Pour
> la mesure brute, suis le protocole du lab (neutraliser la mémoire, Act à froid,
> réactiver, Reuse).

## Protocole
- **Act (à froid)** : mémoire neutralisée (`.claude/memory/reponses-tickets.md` → `.bak`,
  renvoi « Tâches récurrentes » retiré de `CLAUDE.md`), tâche sur le ticket **#1003**.
- **Reuse** : mémoire réactivée, même tâche sur le ticket **#1004**, prompt court.

| Indicateur | Avant (Act, #1003) | Après (Reuse, #1004) |
|------------|--------------------|----------------------|
| Horodatage | 🔲 | 🔲 |
| Allers-retours | 🔲 (attendu : plus) | 🔲 (attendu : moins) |
| Longueur du prompt (mots) | 🔲 | 🔲 (plus court : conventions déjà en mémoire) |
| Ton conforme dès le 1er jet | 🔲 (souvent non) | 🔲 (oui : ton imposé par `.claude/memory`) |
| Retouches nécessaires | 🔲 | 🔲 (moins) |

## Conclusion (≥ 1 indicateur strictement amélioré)
> 🔲 À compléter après ta mesure. Gain attendu : prompt plus court et ton conforme
> dès le 1er jet, car les conventions (catégories, ton, relecture) vivent
> désormais dans `.claude/memory/reponses-tickets.md` au lieu d'être réexpliquées.
> Ce que j'ai enseigné au repo : les conventions de traitement des tickets.
> Comment je l'ai vérifié : la mesure avant/après ci-dessus.
