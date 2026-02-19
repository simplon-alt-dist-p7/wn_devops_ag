import "reflect-metadata";
import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { DataSource } from "typeorm";
import { ArticleMV } from "../entity/ArticleMV.js";
import { Comment } from "../entity/Comment.js";
import { Favorite } from "../entity/Favorite.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isTest = process.env.NODE_ENV === "test";
const envFile = isTest ? ".env.test" : ".env";

const localPath = path.resolve(__dirname, "../../", envFile);
// We use localPath if we want to run locally, and rootPath if we run in Docker
const rootPath = path.resolve(__dirname, "../../../../", envFile);

dotenv.config({ path: rootPath });
dotenv.config({ path: localPath });

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,

  entities: [ArticleMV, Comment, Favorite],

  synchronize: false,
  logging: false,
});
