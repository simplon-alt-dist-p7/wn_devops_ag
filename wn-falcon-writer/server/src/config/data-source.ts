import "reflect-metadata";
import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { DataSource } from "typeorm";

import { Article } from "../entity/article.js";
import { Category } from "../entity/category.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

function required(name: string): string {
    const value = process.env[name];
    if (!value) throw new Error(`Missing environment variable: ${name}`);
    return value;
}

const databaseUrl = process.env.DATABASE_URL?.trim() || null;

const commonConfig = {
    type: "postgres" as const,
    entities: [Article, Category],
    synchronize: false,
    logging: false,
};

export const AppDataSource = databaseUrl
    ? new DataSource({
        ...commonConfig,
        url: databaseUrl,
    })
    : new DataSource({
        ...commonConfig,
        host: required("DB_HOST"),
        port: Number(required("DB_PORT")),
        username: required("DB_USER"),
        password: required("DB_PASSWORD"),
        database: required("DB_NAME"),
    });
