# Bibliothèque de prompts OpsDesk

Prompts versionnés du projet. Chaque prompt est une **spécification exécutable** :
explicite, reproductible, versionnée, relue.

## Convention de nommage

- Un fichier par prompt, en kebab-case : `<verbe>-<objet>.md` (ex. `classer-ticket.md`).
- Les prompts destinés à devenir des slash-commands Claude Code sont copiés dans
  `.claude/commands/<nom>.md` (le nom du fichier devient `/<nom>`).
- Le mot-clé `$ARGUMENTS` marque l'endroit où l'entrée utilisateur est injectée.

## Règle de relecture

Aucun prompt n'entre au dépôt sans une **relecture humaine sur ≥ 2 entrées**.
Chaque prompt porte une section « Sorties observées, relues le AAAA-MM-JJ ».

## Prompts disponibles

| Prompt | Slash-command | Usage |
|--------|---------------|-------|
| `classer-ticket.md` | `/classer-ticket <texte>` | Classification → JSON conforme à `src/classification/schema.ts`. |
| (`.claude/commands/`) `rediger-reponse.md` | `/rediger-reponse <id_ou_texte>` | Brouillon de réponse client. **Relecture humaine avant envoi.** |
| (`.claude/commands/`) `resumer-tickets.md` | `/resumer-tickets` | Synthèse des tickets ouverts (liste + compteur par catégorie). |

## Règle de gouvernance

Toute classification produite par un agent **doit passer dans `parseClassification()`**
(`src/classification/parse.ts`) avant d'être utilisée. Toute sortie non conforme
au schéma est **rejetée**, jamais réparée à la main.
