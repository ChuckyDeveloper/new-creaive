import mongoose from "mongoose";

function requireMongoUri() {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
        throw new Error("Missing MONGODB_URI in environment");
    }
    return uri;
}

export function hasMongoUri() {
    return Boolean(process.env.MONGODB_URI);
}

declare global {
    var __mongooseConn: Promise<typeof mongoose> | undefined;
}

export async function connectDB() {
    if (!global.__mongooseConn) {
        global.__mongooseConn = mongoose.connect(requireMongoUri(), {
            dbName: process.env.MONGODB_DB || undefined,
        });
    }
    return global.__mongooseConn;
}
