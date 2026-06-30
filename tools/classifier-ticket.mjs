// Outil classifier_ticket — contrat clair pour l'agent.
// Nom : verbe-objet. Description (pour l'agent) : « Classe un ticket (sujet +
// corps) en catégorie, priorité et signal humain. N'utilise PAS cet outil pour
// modifier un ticket, seulement pour le classer. »
// Erreur en RÉSULTAT (pas d'exception) : corps vide → { erreur }.
//
// Réutilise le validateur (source de vérité unique) et le classifieur déterministe.
// Importé en .ts : résolu par tsx / Vitest. Pour `node` nu, builder d'abord et
// importer depuis ../dist/classification/*.js.
import { validateClassification } from "../src/classification/schema.ts";
import { classify } from "../src/classification/classify.ts";

export function classifierTicket({ subject = "", body } = {}) {
  if (!body) return { erreur: "corps vide, classification impossible" };
  const sortie = classify({ subject, body });
  const { ok, value, errors } = validateClassification(sortie);
  return ok ? value : { erreur: `sortie non conforme: ${errors.join(", ")}` };
}
