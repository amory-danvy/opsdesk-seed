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
  const ins = db.prepare(
    "INSERT INTO tickets (id, subject, body, category, priority, status, created_at) VALUES (?,?,?,?,?,?,?)",
  );
  ins.run(1, "a", "x", "acces", 1, "open", "t");
  ins.run(2, "b", "x", "bug", 1, "open", "t");
  ins.run(3, "c", "x", "bug", 1, "in_progress", "t");
  ins.run(4, "d", "x", "autre", 1, "closed", "t");
  return db;
}

describe("GET /tickets/stats", () => {
  let app: FastifyInstance;
  beforeEach(() => {
    app = buildApp(makeDb());
  });
  afterEach(async () => {
    await app.close();
  });

  it("renvoie les compteurs par statut", async () => {
    const res = await app.inject({ method: "GET", url: "/tickets/stats" });
    expect(res.statusCode).toBe(200);
    expect(res.json()).toEqual({ open: 2, in_progress: 1, closed: 1 });
  });
});
