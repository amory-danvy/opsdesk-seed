import { describe, it, expect } from "vitest";
import { parseClassification } from "./parse.js";

describe("parseClassification", () => {
  // Cas vert NON trivial : le JSON est enrobé de prose. Prouve l'extraction.
  it("extrait et valide un JSON enrobé de prose", () => {
    const raw = `Voici le résultat : {"categorie":"acces","priorite":3,
      "besoin_humain":false,"confiance":0.85,"justification":"Connexion impossible"}
      Besoin d'autre chose ?`;
    const result = parseClassification(raw);
    expect(result.categorie).toBe("acces");
    expect(result.priorite).toBe(3);
  });

  it("rejette une catégorie hors énumération", () => {
    const raw = JSON.stringify({
      categorie: "spam", // ← invalide
      priorite: 1,
      besoin_humain: false,
      confiance: 0.5,
      justification: "Test",
    });
    expect(() => parseClassification(raw)).toThrow();
  });

  it("rejette une clé manquante (JSON enrobé mais incomplet)", () => {
    const raw = `Voici ma réponse : {"categorie":"bug"}`; // clés manquantes
    expect(() => parseClassification(raw)).toThrow();
  });

  // Contrôle de stabilité : les 2 sorties observées au Lab 1 doivent valider.
  it.each([
    `Classement du ticket : {"categorie":"acces","priorite":3,"besoin_humain":false,"confiance":0.88,"justification":"Erreur 403 a la connexion apres mise a jour"}`,
    `Resultat -> {"categorie":"facturation","priorite":2,"besoin_humain":false,"confiance":0.82,"justification":"Double facturation de l abonnement de mai"}`,
  ])("valide la sortie observée %#", (raw) => {
    expect(() => parseClassification(raw)).not.toThrow();
  });
});
