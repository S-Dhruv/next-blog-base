import * as adapters from "@supergrowthai/next-blog/adapters";
import type {DatabaseAdapter} from "@supergrowthai/next-blog";
import {MongoClient} from "mongodb";

const mongoUrl = process.env.MONGODB_URI || process.env.MONGO_DB_URL;
const useMongo = Boolean(mongoUrl);

let dbProvider: () => Promise<DatabaseAdapter>;

if (useMongo && mongoUrl) {
    // Cache the client promise across invocations
    const globalAny: any = globalThis;
    if (!globalAny._mongoClientPromise) {
        globalAny._mongoClientPromise = new MongoClient(mongoUrl).connect();
    }
    const clientPromise = globalAny._mongoClientPromise;

    dbProvider = async () => {
        const client = await clientPromise;
        const dbName = process.env.MONGODB_DB_NAME || process.env.MONGO_DB_NAME || "next-blog";
        return new adapters.MongoDBAdapter(dbName, client);
    };
    console.log("Using MongoDBAdapter.");
} else {
    dbProvider = async () => {
        throw new Error("Database not configured. Please set MONGODB_URI in your environment variables.");
    };
    console.warn("Database not configured.");
}

export { dbProvider };
