import { parseClassification } from "../src/classification/parse.js";

// Valide une classification hors test : lit le 1er argument, le passe au
// parseur, et log le résultat ou l'erreur (code de sortie non nul si rejet).
const raw = process.argv[2];
if (!raw) {
  console.error(
    "Usage : npx tsx scripts/valider-classification.ts '<JSON ou réponse brute>'",
  );
  process.exit(1);
}

try {
  const result = parseClassification(raw);
  console.log("Validation OK :", result);
} catch (err) {
  console.error("Rejeté :", (err as Error).message);
  process.exit(2);
}
