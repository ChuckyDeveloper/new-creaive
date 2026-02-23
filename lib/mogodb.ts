import mongoose, { Connection, Model, Schema, Document } from "mongoose"

export let cachedUserConnection: Connection | null = null;
export let cachedMailboxConnection: Connection | null = null;

export const connectMongoDB = async (): Promise<Connection> => {

    if (cachedUserConnection) {
        console.log("Using cached db connection (users)");
        return cachedUserConnection;
    }

    if (!process.env.MONGODB_URI) {
        throw new Error("MONGO_USERS environment variable is not defined");
    }

    try {
        const cnx = await mongoose.connect(process.env.MONGODB_URI);
        cachedUserConnection = cnx.connection;
        console.log("New mongodb (users) connection established");

        return cachedUserConnection;


    } catch (error) {
        console.log("Error connection to mongodb: ", error)
        throw error;
    }
}


export const connectMongoDB_Mailboxes = async (): Promise<Connection> => {

    if (cachedMailboxConnection) {
        console.log("Using cached db connection (mailboxes)");
        return cachedMailboxConnection;
    }

    if (!process.env.MONGODB_URI) {
        throw new Error("MONGO_MAILBOXES environment variable is not defined");
    }

    try {
        mongoose.connection.close()
        // const cnx = await mongoose.createConnection(process.env.MONGO_MAILBOXES).asPromise();
        const cnx = await mongoose.connect(process.env.MONGODB_URI)
        cachedMailboxConnection = cnx.connection;
        console.log("New mongodb (mailboxes) connection established");

        return cachedMailboxConnection;

    } catch (error) {
        console.log("Error connection to mongodb: ", error)
        throw error;
    }

}


export const connectMongoDB_Request = async (): Promise<Connection> => {

    if (cachedMailboxConnection) {
        console.log("Using cached db connection (request)");
        return cachedMailboxConnection;
    }

    if (!process.env.MONGODB_URI) {
        throw new Error("Request environment variable is not defined");
    }

    try {
        mongoose.connection.close()
        // const cnx = await mongoose.createConnection(process.env.MONGO_MAILBOXES).asPromise();
        const cnx = await mongoose.connect(process.env.MONGODB_URI)
        cachedMailboxConnection = cnx.connection;
        console.log("New mongodb (request) connection established");

        return cachedMailboxConnection;

    } catch (error) {
        console.log("Error connection to mongodb: ", error)
        throw error;
    }

}

