import { describe, it, expect } from "vitest";
import { classifierTicket } from "./classifier-ticket.mjs";
import { validateClassification } from "../src/classification/schema.ts";

describe("classifierTicket — contrat de l'outil", () => {
  it("classe un bug évident en sortie conforme au schéma", () => {
    const out = classifierTicket({ subject: "Crash", body: "L'export plante avec une erreur 500." });
    expect(validateClassification(out).ok).toBe(true);
    expect(out.categorie).toBe("bug");
  });

  it("classe une demande ambiguë sans crasher (sortie conforme)", () => {
    const out = classifierTicket({ subject: "Bonjour", body: "Pourriez-vous m'aider svp ?" });
    expect(validateClassification(out).ok).toBe(true);
  });

  it("renvoie { erreur } pour un corps vide (erreur en résultat, pas exception)", () => {
    const out = classifierTicket({ subject: "x", body: "" });
    expect(out).toEqual({ erreur: "corps vide, classification impossible" });
  });
});
