import {MongoClient} from "mongodb";
import crypto from "crypto";

function hashPassword(password:string) {
    return crypto.createHash("sha256").update(password).digest("hex");
}

function slugify(str:string) {
    return str.toLowerCase().replace(/\s+/g, "-");
}

export async function createAdminUser() {
    const uri = process.env.MONGODB_URI;
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminUsername = process.env.ADMIN_USERNAME || "DEMO-DEMO-DEMO" ;
    const adminPassword = process.env.ADMIN_PASSWORD;
    const adminName = process.env.ADMIN_NAME || "demo-demo";

    if (!uri || !adminEmail || !adminPassword) {
        throw new Error("Missing required ADMIN_* env variables");
    }

    const client = new MongoClient(uri);

    try {
        await client.connect();
        const db = client.db(process.env.MONGODB_NAME);
        const users = db.collection("users");

        const now = Date.now();
        const passwordHash = hashPassword(adminPassword);
        const slug = slugify(adminUsername);

        const adminUser = {
            username: adminUsername,
            email: adminEmail,
            name: adminName,
            slug,
            bio: "Default administrator account",
            password: passwordHash,
            permissions: ["all:all"],
            isSystem: false,
            createdAt: now,
            updatedAt: now,
        };

        const result = await users.updateOne(
            { email: adminEmail },
            { $setOnInsert: adminUser },
            { upsert: true }
        );

        if (result.upsertedCount === 1) {
            console.log("Admin user created");
        } else {
            console.log("Admin already exists, skipping creation");
        }

    } catch (err) {
        console.error("Error creating admin:", err);
    } finally {
        await client.close();
    }
}

