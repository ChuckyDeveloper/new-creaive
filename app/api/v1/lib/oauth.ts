import crypto from "crypto";

const b64url = (buf: Buffer) =>
    buf.toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");

export function randomStr(bytes = 32) {
    return b64url(crypto.randomBytes(bytes));
}

export function createPKCE() {
    const verifier = randomStr(32);
    const challenge = b64url(crypto.createHash("sha256").update(verifier).digest());
    return { verifier, challenge };
}

export function createState() { return randomStr(16); }
export function createNonce() { return randomStr(16); }