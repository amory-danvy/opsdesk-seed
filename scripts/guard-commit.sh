#!/usr/bin/env bash
# guard-commit.sh : détection DÉTERMINISTE de secrets et violations de convention.
# Hook PreToolUse (Bash) de Claude Code. Code de sortie 2 = blocage de l'outil.

INPUT="$(cat)"   # le hook reçoit un JSON sur stdin ; la commande est dans tool_input.command

# On ne contrôle que les commandes de commit.
if ! echo "$INPUT" | grep -q 'git commit'; then
  exit 0
fi

# Motifs de secrets, cherchés dans le contenu STAGÉ (le secret est dans le fichier,
# pas dans la commande). On exclut le script lui-même, qui contient les motifs.
STAGED="$(git diff --cached -- . ':(exclude)scripts/guard-commit.sh')"
if echo "$STAGED" | grep -qE \
  'opsdesk_live_|AKIA[0-9A-Z]{16}|-----BEGIN( [A-Z]+)? PRIVATE KEY-----|password\s*='; then
  echo "BLOQUÉ : secret potentiel détecté dans le commit." >&2
  exit 2
fi

# Convention OpsDesk : pas de fichier .env non-example commité.
if git diff --cached --name-only | grep -E '(^|/)\.env' | grep -v '\.env\.example' | grep -q .; then
  echo "BLOQUÉ : fichier .env non-example détecté." >&2
  exit 2
fi

exit 0
