# Démo OpsDesk — 5 minutes (rejouable depuis ce seul fichier)

> Pré-requis : Node LTS 20–22 (pas Node 24), dépôt cloné. Toutes les commandes
> depuis la racine du dépôt.

```bash
# 1. Installer + cible verte (≈1 min)
npm ci
npm run build            # compile sans erreur
npm test                 # suite Vitest verte (J1→J4)

# 2. Sortie structurée validée (J2)
npx tsx scripts/valider-classification.ts \
  '{"categorie":"facturation","priorite":2,"besoin_humain":false,"confiance":0.82,"justification":"Double facturation"}'
# → "Validation OK"

# 3. Hook anti-secret (J2) — voir la preuve capturée
cat docs/preuves/j2-hook-blocage.txt

# 4. API + endpoints (J3/J4)
npm run seed             # tickets de démo (ids 1001–1012)
npm run dev &            # démarre Fastify sur :3000 (laisser tourner)
sleep 2
curl -s localhost:3000/health                 # {"status":"ok"}
curl -s localhost:3000/tickets/stats          # {"open":...,"in_progress":...,"closed":...}
curl -s localhost:3000/tickets/1001/reply-suggestion
kill %1                  # arrêter le serveur

# 5. Serveur MCP tickets (J4) — accès base gouverné
claude mcp add tickets -- node "$(pwd)/mcp/tickets-server.mjs"
claude mcp list          # tickets ✓ connected

# 6. Revue agentique (J5) — validation locale du rendu de verdict
node scripts/publier-verdict.mjs \
  '{"verdict":"request_changes","summary":"route sans test","findings":[{"severity":"high","file":"src/server.ts","message":"/tickets/:id/close sans test"}]}'
```

> Windows / PowerShell : utiliser `curl.exe` (le `curl` de PowerShell est un alias
> d'`Invoke-WebRequest`). Node 22 portable si la machine est en Node 24.
