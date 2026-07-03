import { ClassificationSchema, type Classification } from "./schema.js";

// Extrait un objet JSON d'une réponse (éventuellement bavarde) et le valide
// contre le schéma. Lève une erreur explicite si rien n'est extractible ou si
// la sortie ne respecte pas le contrat. On ne « répare » jamais : on rejette.
export function parseClassification(raw: string): Classification {
  // Extraction : du premier « { » au dernier « } » de la réponse.
  const match = raw.match(/\{[\s\S]*\}/);
  if (!match) throw new Error("Aucun JSON trouvé dans la réponse");

  let parsed: unknown;
  try {
    parsed = JSON.parse(match[0]);
  } catch {
    throw new Error("JSON invalide");
  }

  // Validation par le schéma : lève si non conforme.
  return ClassificationSchema.parse(parsed);
}
