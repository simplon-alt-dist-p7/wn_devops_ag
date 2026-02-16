import { Client } from "pg";
import dotenv from "dotenv";
dotenv.config();

export async function startListener() {
    const client = new Client({
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        password: process.env.DB_PASSWORD,
        port: Number(process.env.DB_PORT),
    });

    await client.connect();
    console.log("Connected to PostgreSQL for notifications");

    await client.query("LISTEN articles_update");

    client.on("notification", async (msg) => {
        console.log(`Notification received: ${msg.payload}`);
        try {
            await client.query(
                "REFRESH MATERIALIZED VIEW CONCURRENTLY reader.mv_articles;"
            );
            console.log("Materialized view refreshed!");
        } catch (err) {
            console.error("Error refreshing materialized view:", err);
        }
    });

    client.on("error", (err) => {
        console.error("PostgreSQL client error:", err);
    });
}
