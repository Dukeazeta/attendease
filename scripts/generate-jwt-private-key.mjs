import { generateKeyPairSync } from "node:crypto";

const { privateKey } = generateKeyPairSync("rsa", { modulusLength: 2048 });
const pem = privateKey.export({ type: "pkcs8", format: "pem" }).toString();
const singleLine = pem.trimEnd().replace(/\n/g, " ");

console.log("# PEM format (multiline):");
console.log(pem);
console.log("\n# Convex env var format (single line):");
console.log(`JWT_PRIVATE_KEY=\"${singleLine}\"`);
