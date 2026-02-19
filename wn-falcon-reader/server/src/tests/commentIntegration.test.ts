import { describe, it, expect, beforeAll, beforeEach } from "vitest";
import request from "supertest";
import app from "../app.js";
import { AppDataSource } from "../config/data-source.js";
import { pool } from "./setup.js";

describe("Comments Integration", () => {
  beforeAll(async () => {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }
  });

  beforeEach(async () => {
    await pool.query("TRUNCATE writer.t_articles RESTART IDENTITY CASCADE");
  });

  // ----- Post should success -----
  it("should return 201 and create a new comment", async () => {
    const newArticle = await pool.query(
      `INSERT INTO writer.t_articles (title, subtitle, summary, content, id_category) 
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id_article`,
      ["Un titre", "Un sous-titre", "Un résumé", "Le corps de l'article", 1],
    );

    const articleId = newArticle.rows[0].id_article;

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

  //   // ----- Get should Success -----
  // it("should get comments for a specific article", async () => {
  //   vi_actions.getMany.mockResolvedValue([
  //     { id: 1, description: "Commentaire test", article_id: 1 },
  //   ]);

  //   const response = await request(app).get("/articles/1/comments");

  //   expect(response.status).toBe(200);
  //   expect(Array.isArray(response.body)).toBe(true);
  //   expect(response.body[0].description).toBe("Commentaire test");
  // });
  //   // ----- Get should fail -----
  //   it("should return 500 if there's an error fetching comments", async () => {
  //     vi_actions.getMany.mockRejectedValue(new Error("DB error"));
  //     const response = await request(app).get("/articles/1/comments");

  //     expect(response.status).toBe(500);
  //     expect(response.body.error).toBe("Internal server error.");
  //   });

  //   // ----- Post should fail -----
  //   it("should return 400 if description is missing", async () => {
  //     const response = await request(app).post("/articles/1/comments").send({});

  //     expect(response.status).toBe(400);
  //     expect(response.body.error).toBe("Le message est requis.");
  //   });
});
