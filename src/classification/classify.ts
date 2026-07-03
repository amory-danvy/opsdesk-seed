import { CATEGORIES, type Classification } from "./schema.js";

// Classifieur DÉTERMINISTE à règles (stub). Le projet réel déléguerait cette
// logique à un modèle ; le rester déterministe rend les scripts en lot TESTABLES
// (l'idempotence se prouve sans dépendre de la stabilité d'un LLM).
export function classify(input: { subject?: string; body: string }): Classification {
  const t = `${input.subject ?? ""} ${input.body}`.toLowerCase();
  const categorie: (typeof CATEGORIES)[number] =
    /connexion|login|403|acc[eè]s|mot de passe|2fa|locked/.test(t) ? "acces" :
    /factur|paiement|abonnement|rembours|charge|invoice|refund/.test(t) ? "facturation" :
    /erreur|bug|plante|crash|500|duplicat/.test(t) ? "bug" :
    /pourriez|possible|ajouter|demande|add|need/.test(t) ? "demande" : "autre";
  const priorite = /urgent|bloqu|impossible|critique|locked|500/.test(t) ? 3
    : /erreur|bug|crash/.test(t) ? 2 : 1;
  const confiance = categorie === "autre" ? 0.5 : 0.8;
  return {
    categorie,
    priorite,
    besoin_humain: categorie === "autre" || confiance < 0.7,
    confiance,
    justification: `Classé '${categorie}' (priorité ${priorite}) par règles sur sujet+corps.`,
  };
}
