import { describe, it, expect, beforeAll, beforeEach } from "vitest";
import request from "supertest";
import app from "../app.js";
import { AppDataSource } from "../config/data-source.js";
import { pool } from "./setup.js";

describe("Comments Integration", () => {
  let articleId: number;

  // We wait for the DataSource to initialize before running any tests
  beforeAll(async () => {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }
  });

  // We reset the database before each test
  beforeEach(async () => {
    await pool.query("TRUNCATE writer.t_articles RESTART IDENTITY CASCADE");

    const newArticle = await pool.query(
      `INSERT INTO writer.t_articles (title, subtitle, summary, content, id_category) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING id_article`,
      ["Article de Test", "Sous-titre", "Résumé", "Le corps de l'article", 1],
    );

    articleId = newArticle.rows[0].id_article;

    await pool.query(
      `INSERT INTO reader.t_comments (description, article_id) 
       VALUES ($1, $2)`,
      ["Premier commentaire", articleId],
    );

    await pool.query(
      `INSERT INTO reader.t_comments (description, article_id) 
       VALUES ($1, $2)`,
      ["Deuxième commentaire", articleId],
    );
  });

  // ----- Get should success -----
  it("should return 200 and a list of comments for an article", async () => {
    const response = await request(app).get(`/articles/${articleId}/comments`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(2);
    expect(response.body[0].description).toBe("Deuxième commentaire"); //comments are ordered by last created first
    expect(response.body[1].description).toBe("Premier commentaire");
  });

  // ----- Post should success -----
  it("should return 201 and create a new comment", async () => {
    const response = await request(app)
      .post(`/articles/${articleId}/comments`)
      .send({ description: "Ceci est un commentaire de test :)" });

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      description: "Ceci est un commentaire de test :)",
      article_id: articleId,
    });
    expect(response.body.id).toBeDefined();
  });

  // ----- Post should fail -----
  it("should return 400 if description is missing", async () => {
    const response = await request(app)
      .post(`/articles/${articleId}/comments`)
      .send({});

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("Le message est requis.");
    expect(response.body).not.toHaveProperty("body");
  });
});
