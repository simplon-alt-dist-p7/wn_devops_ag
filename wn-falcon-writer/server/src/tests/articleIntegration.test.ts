import { describe, it, expect, beforeAll, beforeEach } from "vitest";
import request from "supertest";
import app from "../app.js";
import { AppDataSource } from "../config/data-source.js";
import { pool } from "./setup.js";

describe("Articles Integration", () => {
  let firstArticleId: number;
  let secondArticleId: number;

  // We wait for the DataSource to initialize before running any tests
  beforeAll(async () => {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }
  });

  // We reset the database before each test
  beforeEach(async () => {
    await pool.query("TRUNCATE writer.t_articles RESTART IDENTITY CASCADE");

    const firstArticle = await pool.query(
      `INSERT INTO writer.t_articles (title, subtitle, summary, content, id_category) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING id_article`,
      [
        "Les chats",
        "Ils veulent dominer les humains",
        "C'est un article sur les chats",
        "L'objectif secret des chats est de dominer les humains et la domination de la terre",
        1,
      ],
    );

    const secondArticle = await pool.query(
      `INSERT INTO writer.t_articles (title, subtitle, summary, content, id_category) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING id_article`,
      [
        "Les chiens",
        "Ils sont fidèles aux humains",
        "C'est un article sur les chiens",
        "Les chiens sont des animaux de compagnie très fidèles, souvent considérés comme les meilleurs amis de l'homme. Ils offrent une compagnie inestimable et sont connus pour leur loyauté envers leurs propriétaires.",
        2,
      ],
    );

    firstArticleId = firstArticle.rows[0].id_article;
    secondArticleId = secondArticle.rows[0].id_article;
  });

  describe("Articles API Integration Tests", () => {
    // ----- GetAll should success -----
    it("should return 200 and a list of articles", async () => {
      const response = await request(app).get("/articles");
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(2);
      expect(response.body[0].title).toBe("Les chiens"); // articles are ordered by last published first
      expect(response.body[1].title).toBe("Les chats");
    });

    // ----- GetArticleById should success -----
    it("should return 200 and the article with id 1", async () => {
      const response = await request(app).get(`/articles/${firstArticleId}`);
      expect(response.status).toBe(200);
      expect(response.body.id).toBe(1);
      expect(response.body.title).toBe("Les chats");
    });

    // ----- Post should success -----
    it("should return 201 when creating a new article", async () => {
      const newArticle = {
        title: "Nouvel Article",
        subtitle: "Un petit sous-titre",
        summary: "Un petit résumé",
        content: "Le contenu complet",
        category: { id: 1 },
      };

      const response = await request(app).post("/articles").send(newArticle);

      expect(response.status).toBe(201);
      expect(response.body).toMatchObject({
        title: "Nouvel Article",
        subtitle: "Un petit sous-titre",
        summary: "Un petit résumé",
        content: "Le contenu complet",
        category: { id: 1 },
      });
      expect(response.body.id).toBeDefined();
    });

    // ----- Post should fail -----
    it("should return 400 if a creation field (title) is missing", async () => {
      const incompleteArticle = {
        subtitle: "Un petit sous-titre",
        summary: "Un petit résumé",
        content: "Le contenu complet",
      };

      const response = await request(app)
        .post("/articles")
        .send(incompleteArticle);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("message");
    });

    // ----- Patch should success -----
    it("should return 200 when updating an existing article", async () => {
      const response = await request(app)
        .patch(`/articles/${firstArticleId}`)
        .send({
          subtitle: "Ils veulent dominer le monde entier",
        });

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        id: firstArticleId,
        title: "Les chats",
        subtitle: "Ils veulent dominer le monde entier",
        summary: "C'est un article sur les chats",
        content:
          "L'objectif secret des chats est de dominer les humains et la domination de la terre",
      });
    });

    // ----- Delete should success -----
    it("it should return a 204 when deleting an article but keep it in archive for us (Soft Delete)", async () => {
      const response = await request(app).delete(
        `/articles/${secondArticleId}`,
      );

      expect(response.status).toBe(204);

      const article = await AppDataSource.getRepository("Article").findOne({
        where: { id: secondArticleId },
        withDeleted: true,
      });

      // The article should still exist in the database, but be marked as deleted with a deletion date
      expect(article).not.toBeNull();

      const deletionDate = article?.deleted_at;

      expect(deletionDate).toBeDefined();

      expect(new Date(deletionDate)).toBeInstanceOf(Date);
    });
  });
});
