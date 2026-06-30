import Database from "better-sqlite3";
import { beforeEach, afterEach, describe, expect, it } from "vitest";
import { buildApp } from "../src/server.js";
import type { FastifyInstance } from "fastify";

function makeDb() {
  const db = new Database(":memory:");
  db.exec(`
    CREATE TABLE tickets (
      id INTEGER PRIMARY KEY, subject TEXT, body TEXT, category TEXT,
      priority INTEGER, status TEXT, created_at TEXT
    );
  `);
  db.prepare(
    "INSERT INTO tickets (id, subject, body, category, priority, status, created_at) VALUES (?,?,?,?,?,?,?)",
  ).run(1, "Cannot log in", "403 error", "acces", 3, "open", "2026-05-12T09:14:00Z");
  return db;
}

describe("GET /tickets/:id/reply-suggestion", () => {
  let app: FastifyInstance;
  beforeEach(() => {
    app = buildApp(makeDb());
  });
  afterEach(async () => {
    await app.close();
  });

  it("renvoie une suggestion pour un ticket existant", async () => {
    const res = await app.inject({ method: "GET", url: "/tickets/1/reply-suggestion" });
    expect(res.statusCode).toBe(200);
    const body = res.json();
    expect(body.id).toBe(1);
    expect(body.category).toBe("acces");
    expect(typeof body.suggestion).toBe("string");
    expect(body.suggestion.length).toBeGreaterThan(0);
    expect(body.review_required).toBe(true);
  });

  it("renvoie 404 pour un ticket inconnu", async () => {
    const res = await app.inject({ method: "GET", url: "/tickets/999/reply-suggestion" });
    expect(res.statusCode).toBe(404);
    expect(res.json()).toEqual({ error: "ticket not found" });
  });
});
