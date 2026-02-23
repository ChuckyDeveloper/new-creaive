import jwt from "jsonwebtoken";

function requireSecret() {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error("Missing JWT_SECRET");
    }
    return secret;
}

export type SessionClaims = {
    sub: string;
    role: "user" | "manager" | "admin" | "master";
    username: string;
    email: string;
    name: string;
};

export function signSession(payload: SessionClaims, expiresIn: string = "7d") {
    return jwt.sign(payload, requireSecret(), { algorithm: "HS256", expiresIn });
}

export function verifySession<T = SessionClaims>(token: string): T {
    return jwt.verify(token, requireSecret()) as T;
}
