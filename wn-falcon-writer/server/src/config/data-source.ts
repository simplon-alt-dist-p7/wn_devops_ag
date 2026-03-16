import "reflect-metadata";
import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { DataSource } from "typeorm";

import { Article } from "../entity/article.js";
import { Category } from "../entity/category.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isTest = process.env.NODE_ENV === "test" || process.env.VITEST === "true";
const envFile = isTest ? ".env.test" : ".env";

const rootPath = path.resolve(process.cwd(), "../../", envFile);
const fallbackPath = path.resolve(__dirname, "../../", envFile);

dotenv.config({ path: rootPath, override: true });
dotenv.config({ path: fallbackPath, override: true });

function required(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing variable: ${name} (Env: ${envFile})`);
  return value;
}

const commonConfig = {
  type: "postgres" as const,
  entities: [Article, Category],
  synchronize: false,
  logging: false,
};

export const AppDataSource = new DataSource({
  ...commonConfig,
  host: required("DB_HOST"),
  port: Number(required("DB_PORT")),
  username: required("DB_USER"),
  password: required("DB_PASSWORD"),
  database: required("DB_NAME"),
});
