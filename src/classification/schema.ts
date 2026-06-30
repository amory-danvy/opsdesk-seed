// Schéma de classification d'un ticket OpsDesk.
// Source de vérité partagée par tout le projet (prompt, parseur, tests, outils MCP).
import { z } from "zod";

// Énumération fermée des catégories (alignée sur les valeurs du seed).
export const CATEGORIES = ["acces", "facturation", "bug", "demande", "autre"] as const;

export const ClassificationSchema = z.object({
  categorie: z.enum(CATEGORIES),
  priorite: z.int().min(1).max(3), // 1 = basse, 2 = moyenne, 3 = haute
  besoin_humain: z.boolean(),
  confiance: z.number().min(0).max(1),
  justification: z.string().min(1).max(280),
});

export type Classification = z.infer<typeof ClassificationSchema>;

// Validateur « maison » (réutilisé au module 4, côté .mjs) : ne lève pas,
// renvoie { ok, value, errors } pour traiter l'erreur comme un résultat.
export function validateClassification(
  input: unknown,
): { ok: true; value: Classification } | { ok: false; value: null; errors: string[] } {
  const result = ClassificationSchema.safeParse(input);
  if (result.success) {
    return { ok: true, value: result.data };
  }
  const errors = result.error.issues.map(
    (i) => `${i.path.join(".") || "(racine)"}: ${i.message}`,
  );
  return { ok: false, value: null, errors };
}
