// lib/password.ts
import bcrypt from "bcryptjs";

/** Hash a plain password (async) */
export async function hashPassword(plain: string): Promise<string> {
    if (!plain || plain.length < 8) {
        throw new Error("Password must be at least 8 characters");
    }
    const rounds = Number(process.env.BCRYPT_SALT_ROUNDS ?? 10);
    const salt = await bcrypt.genSalt(rounds);
    return bcrypt.hash(plain, salt);
}

/** Verify a plain password against a previously stored bcrypt hash */
export function verifyPassword(plain: string, hash: string): Promise<boolean> {
    return bcrypt.compare(plain, hash);
}
