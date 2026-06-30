// Serveur MCP « tickets » : expose 3 outils INTENTIONNELS sur la base OpsDesk.
// Règle absolue : AUCUN outil générique run_query / execute_sql. Chaque outil
// construit lui-même une requête PARAMÉTRÉE (jamais de concaténation de chaîne).
// Branchement : claude mcp add tickets -- node "$(pwd)/mcp/tickets-server.mjs"
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import Database from "better-sqlite3";
import { z } from "zod";

const DB_PATH = process.env.DB_PATH ?? "data/opsdesk.db";
const db = new Database(DB_PATH);

const STATUSES = ["open", "in_progress", "closed"];
const ok = (data) => ({ content: [{ type: "text", text: JSON.stringify(data) }] });

const server = new McpServer({ name: "tickets", version: "1.0.0" });

// 1) list_tickets : liste filtrée (statut optionnel).
server.tool(
  "list_tickets",
  { status: z.enum(STATUSES).optional() },
  async ({ status }) => {
    const rows = status
      ? db.prepare("SELECT id, subject, category, priority, status FROM tickets WHERE status = ? ORDER BY id").all(status)
      : db.prepare("SELECT id, subject, category, priority, status FROM tickets ORDER BY id").all();
    return ok(rows);
  },
);

// 2) get_ticket : un ticket, ou { erreur } si introuvable (erreur en résultat).
server.tool(
  "get_ticket",
  { id: z.number().int() },
  async ({ id }) => {
    const row = db.prepare("SELECT * FROM tickets WHERE id = ?").get(id);
    return ok(row ?? { erreur: `ticket ${id} introuvable` });
  },
);

// 3) update_ticket_status : transition de statut (validée par énumération).
server.tool(
  "update_ticket_status",
  { id: z.number().int(), status: z.enum(STATUSES) },
  async ({ id, status }) => {
    const res = db.prepare("UPDATE tickets SET status = ? WHERE id = ?").run(status, id);
    if (res.changes === 0) return ok({ erreur: `ticket ${id} introuvable` });
    return ok({ id, status, updated: true });
  },
);

const transport = new StdioServerTransport();
await server.connect(transport);
