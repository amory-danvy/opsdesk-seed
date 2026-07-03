# Note d'arbitrage — orchestration OpsDesk (J4-X)

Sur OpsDesk, j'ai livré la feature `GET /tickets/stats` via un pipeline
**planner → builder → reviewer** : le planner produit `plans/stats.plan.md`, le
builder écrit la route (réutilisant `listTickets()`, sans nouveau SQL) et son
test, le reviewer rend un verdict écrit dans `reviews/stats.review.md`. Trois
**points de contrôle humains** jalonnent les jonctions (valider le plan, exiger
des tests verts, trancher le merge), chacun tracé en une ligne.

J'ai choisi une orchestration **séquentielle et observable** — l'état vit dans
des fichiers (`plans/`, `reviews/`, `TODO.md`, `journal/`), chaque transition
passe par un humain. C'est exactement le critère qui compte : je peux encore
**observer et gouverner** ce que font les agents. En citant le débat (position de
Zechner : le **spawn massif parallèle de sous-agents est un anti-pattern**, au
profit de peu de processus observables, état-en-fichiers, relecture humaine), je
n'ai **pas** opté pour un fan-out parallèle ici : le gain (latence) ne compense
pas la perte d'observabilité sur un pipeline à 3 étapes dépendantes, où chaque
sortie est l'entrée validée de la suivante.

Je **reconsidérerais le parallèle** dans un cas précis et borné : des tâches
**indépendantes et nombreuses** sans dépendance d'ordre (ex. classer en lot 500
tickets, ou lancer N revues sur des fichiers disjoints), où le fan-out est
mesurablement plus rapide **et** reste gouvernable (résultats agrégés, journaux
par tâche). Le critère de décision n'est pas « séquentiel vs parallèle » en
absolu, mais : **est-ce que je garde la capacité d'observer et de gouverner ?**
