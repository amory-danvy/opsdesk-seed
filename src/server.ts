import Fastify, { type FastifyInstance } from "fastify";
import type BetterSqlite3 from "better-sqlite3";
import { PORT } from "./config.js";
import { getTicket, listTickets, updateTicketStatus } from "./tickets.js";

type DB = BetterSqlite3.Database;

// Brouillon de réponse suggéré selon la catégorie du ticket (déterministe).
// Réservé à une relecture humaine avant tout envoi (cf. /rediger-reponse).
function suggestReply(category: string): string {
  switch (category) {
    case "acces":
      return "Bonjour, nous avons bien noté votre problème d'accès. Pouvez-vous nous préciser le message d'erreur exact ? Nous vérifions votre compte et revenons vers vous rapidement.";
    case "facturation":
      return "Bonjour, merci pour votre message concernant votre facturation. Nous vérifions votre dossier et revenons vers vous sous peu ; aucune action n'est requise de votre part pour l'instant.";
    case "bug":
      return "Bonjour, merci pour ce signalement. Nous reproduisons le problème de notre côté et vous tiendrons informé de la correction.";
    case "demande":
      return "Bonjour, merci pour votre suggestion. Nous la transmettons à notre équipe produit et revenons vers vous si nous avons besoin de précisions.";
    default:
      return "Bonjour, merci pour votre message. Nous l'examinons et revenons vers vous rapidement.";
  }
}

// Construit l'application Fastify (sans écouter) : permet les tests via app.inject().
// `database` optionnel (défaut : la base partagée) — même convention de DI que src/tickets.ts.
export function buildApp(database?: DB): FastifyInstance {
  const app = Fastify({ logger: false });

  // Sonde de santé (utilisée comme critère de vérification d'environnement).
  app.get("/health", async () => {
    return { status: "ok" };
  });

  // Liste tous les tickets.
  app.get("/tickets", async () => {
    return listTickets(database);
  });

  // Compteurs par statut (réutilise listTickets, aucun nouveau SQL).
  app.get("/tickets/stats", async () => {
    const stats = { open: 0, in_progress: 0, closed: 0 };
    for (const t of listTickets(database)) {
      if (t.status === "open") stats.open++;
      else if (t.status === "in_progress") stats.in_progress++;
      else if (t.status === "closed") stats.closed++;
    }
    return stats;
  });

  // Retourne un ticket par identifiant.
  app.get<{ Params: { id: string } }>("/tickets/:id", async (request, reply) => {
    const id = Number(request.params.id);
    const ticket = getTicket(id, database);
    if (!ticket) {
      return reply.code(404).send({ error: "ticket not found" });
    }
    return ticket;
  });

  // Suggère un brouillon de réponse pour un ticket (relecture humaine obligatoire).
  app.get<{ Params: { id: string } }>(
    "/tickets/:id/reply-suggestion",
    async (request, reply) => {
      const id = Number(request.params.id);
      const ticket = getTicket(id, database);
      if (!ticket) {
        return reply.code(404).send({ error: "ticket not found" });
      }
      return {
        id: ticket.id,
        category: ticket.category,
        suggestion: suggestReply(ticket.category),
        review_required: true,
      };
    },
  );

  // Ferme un ticket. NOTE : route ajoutée volontairement SANS test (défaut
  // planté pour la démo de revue agentique J5 — l'agent doit la signaler).
  app.post<{ Params: { id: string } }>("/tickets/:id/close", async (request, reply) => {
    const id = Number(request.params.id);
    const updated = updateTicketStatus(id, "closed", database);
    if (!updated) {
      return reply.code(404).send({ error: "ticket not found" });
    }
    return getTicket(id, database);
  });

  // Met à jour le statut d'un ticket.
  app.post<{ Params: { id: string }; Body: { status?: string } }>(
    "/tickets/:id/status",
    async (request, reply) => {
      const id = Number(request.params.id);
      const status = request.body?.status;
      if (!status) {
        return reply.code(400).send({ error: "status is required" });
      }
      const updated = updateTicketStatus(id, status, database);
      if (!updated) {
        return reply.code(404).send({ error: "ticket not found" });
      }
      return getTicket(id, database);
    },
  );

  return app;
}

// Démarrage réel uniquement quand le fichier est exécuté directement (npm run dev).
const isMain = process.argv[1] && process.argv[1].endsWith("server.ts");
if (isMain) {
  const app = buildApp(); // base partagée par défaut
  app
    .listen({ port: PORT, host: "0.0.0.0" })
    .then((address) => {
      app.log.info(`OpsDesk listening on ${address}`);
    })
    .catch((err) => {
      app.log.error(err);
      process.exit(1);
    });
}
