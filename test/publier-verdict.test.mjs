import { describe, it, expect } from "vitest";
import { validerVerdict, rendreMarkdown, MARQUEUR } from "../scripts/publier-verdict.mjs";

const VALIDE = {
  verdict: "request_changes",
  summary: "Une route ajoutée sans test.",
  findings: [{ severity: "high", file: "src/server.ts", message: "route /tickets/:id/close sans test" }],
};

describe("publier-verdict — validation interne", () => {
  it("accepte un verdict conforme (et tolère le JSON en chaîne)", () => {
    expect(validerVerdict(VALIDE).verdict).toBe("request_changes");
    expect(validerVerdict(JSON.stringify(VALIDE)).findings).toHaveLength(1);
  });

  it("rejette un JSON invalide", () => {
    expect(() => validerVerdict("pas du json")).toThrow();
  });

  it("rejette un verdict hors énumération", () => {
    expect(() => validerVerdict({ ...VALIDE, verdict: "merge" })).toThrow();
  });

  it("rejette un finding sans severity valide", () => {
    expect(() => validerVerdict({ ...VALIDE, findings: [{ severity: "x", file: "a", message: "b" }] })).toThrow();
  });
});

describe("publier-verdict — rendu markdown", () => {
  it("inclut le marqueur d'idempotence (upsert)", () => {
    expect(rendreMarkdown(VALIDE)).toContain(MARQUEUR);
  });
  it("rend les findings en tableau", () => {
    const md = rendreMarkdown(VALIDE);
    expect(md).toContain("route /tickets/:id/close sans test");
    expect(md).toContain("| Sévérité |");
  });
});
