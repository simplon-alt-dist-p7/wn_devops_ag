import dotenv from "dotenv";
import { beforeEach, afterAll } from "vitest";
import { Pool } from "pg";
import path from "path/win32";

dotenv.config({ path: path.resolve(process.cwd(), "../../.env.test") });

process.env.DB_NAME = "wn_db_test";

const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: "wn_db_test",
});

beforeEach(async () => {
  await pool.query(`
    TRUNCATE 
      reader.t_comments, 
      reader.t_article_favorite,
      writer.t_articles 
    RESTART IDENTITY CASCADE;
  `);

  await pool.query("REFRESH MATERIALIZED VIEW reader.mv_articles;");
});

afterAll(async () => {
  await pool.end();
});

export { pool };
