import "reflect-metadata";
import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { DataSource } from "typeorm";

import { Article } from "../entity/article.js";
import { Category } from "../entity/category.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isTest = process.env.NODE_ENV === "test";
const envFile = isTest ? ".env.test" : ".env";

const localPath = path.resolve(__dirname, "../../", envFile);
// We use localPath if we want to run locally, and rootPath if we run in Docker
const rootPath = path.resolve(__dirname, "../../../../", envFile);

dotenv.config({ path: rootPath });
dotenv.config({ path: localPath });

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
