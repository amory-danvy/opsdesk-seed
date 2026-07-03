// Wrapper CLI : matérialise le saut « slash-command → fonction-outil ».
// Lit l'argument (le texte du ticket → body), appelle classifierTicket, imprime
// le résultat en JSON. Lancer via tsx (résout l'import .ts) :
//   npx tsx tools/run-classifier.mjs "<texte du ticket>"
import { classifierTicket } from "./classifier-ticket.mjs";

const body = process.argv[2] ?? "";
const subject = process.argv[3] ?? "";
console.log(JSON.stringify(classifierTicket({ subject, body })));
