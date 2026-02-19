import { describe, it, expect, vi } from "vitest";
import request from "supertest";
import { AppDataSource } from "../config/data-source.js";
import { Article } from "../entity/article.js";

const { vi_actions } = vi.hoisted(() => ({
  vi_actions: {
    findOne: vi.fn(),
    getMany: vi.fn(),
  },
}));
// vi.mock intercepts any import of the data-source.js file and replaces it with our custom implementation defined in the callback function.
vi.mock("../config/data-source.js", () => ({
  AppDataSource: {
    // Simulates the DB connection (always returns "success" to avoid blocking tests)
    initialize: vi.fn().mockResolvedValue(true),

    // Simulates the getRepository(Article) method
    getRepository: vi.fn().mockReturnValue({
      /* --- READ OPERATIONS (GET) --- */
      // These methods simulate the "QueryBuilder" (e.g., SELECT * FROM articles...)
      createQueryBuilder: vi.fn().mockReturnThis(),
      leftJoinAndSelect: vi.fn().mockReturnThis(),
      orderBy: vi.fn().mockReturnThis(),
      addOrderBy: vi.fn().mockReturnThis(),
      take: vi.fn().mockReturnThis(),

      // We link the final result to our external vi_actions (findOne / getMany)

      getMany: vi_actions.getMany,
      findOne: vi_actions.findOne,
      findOneBy: vi_actions.findOne,

      /* --- WRITE OPERATIONS (POST / PATCH / DELETE) --- */
      // create() takes a raw object and turns it into an Entity
      create: vi.fn().mockImplementation((d) => d),

      // save() simulates database persistence.
      // We return the sent object (d) and append a fake ID (id: 1) to simulate the DB auto-increment
      save: vi.fn().mockImplementation((d) => Promise.resolve({ id: 1, ...d })),

      // merge() overlays new values onto an existing article object (used for PATCH)
      // Object.assign(dest, src) copies properties from the source to the destination
      merge: vi
        .fn()
        .mockImplementation((dest, src) => Object.assign(dest, src)),

      // update() and delete() simulate actions affecting table rows
      // "affected: 1" tells the service that one row was successfully modified/deleted
      update: vi.fn().mockResolvedValue({ affected: 1 }),
      delete: vi.fn().mockResolvedValue({ affected: 1 }),
    }),
  },
}));

import app from "../app.js";

// ----- GetAll should success -----
describe.skip("Articles API Integration Tests", () => {
  it("should return 200 and a list of articles", async () => {
    vi_actions.getMany.mockResolvedValue([{ id: 1, title: "Article de test" }]);

    const response = await request(app).get("/articles");
    expect(response.status).toBe(200);
    expect(response.body[0].title).toBe("Article de test");
  });

  // ----- GetById should success -----
  it("should return 200 if article exists", async () => {
    vi_actions.findOne.mockResolvedValue({ id: 1, title: "Article Unique" });

    const response = await request(app).get("/articles/1");
    expect(response.status).toBe(200);
    expect(response.body.id).toBe(1);
  });

  // ----- GetById should fail -----
  it("should return 404 if article is missing", async () => {
    vi_actions.findOne.mockResolvedValue(null);

    const response = await request(app).get("/articles/999");
    expect(response.status).toBe(404);
  });

  // ----- Post should should fail -----
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

  // ----- Post should Success -----
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
  });

  // ----- Patch should Success -----
  it("should return 200 when updating an existing article", async () => {
    vi_actions.findOne.mockResolvedValue({ id: 1, title: "Ancien Titre" });

    const response = await request(app)
      .patch("/articles/1")
      .send({
        id: 1,
        title: "Nouveau Titre",
        subtitle: "Sous-titre inchangé",
        summary: "Résumé inchangé",
        content: "Contenu inchangé",
        category: { id: 1 },
      });

    expect(response.status).toBe(200);
  });

  // ----- Patch should fail -----
  it("should return 404 when trying to update a non-existing article", async () => {
    vi_actions.findOne.mockResolvedValue(null);

    const response = await request(app)
      .patch("/articles/999")
      .send({
        id: 999,
        title: "Nouveau Titre",
        subtitle: "Sous-titre inchangé",
        summary: "Résumé inchangé",
        content: "Contenu inchangé",
        category: { id: 1 },
      });

    expect(response.status).toBe(404);
  });

  // ----- Delete should Success -----
  it("should return 204 when deleting an article successfully", async () => {
    vi_actions.findOne.mockResolvedValue({
      id: 1,
      title: "Article à supprimer",
    });

    const repo = AppDataSource.getRepository(Article);
    vi.mocked(repo.update).mockResolvedValueOnce({
      affected: 1,
      raw: [],
      generatedMaps: [],
    });

    const response = await request(app).delete("/articles/1");

    expect(response.status).toBe(204);
  });
  // ----- Delete Should fail -----
  it("should return 404 when trying to delete a non-existing article", async () => {
    vi_actions.findOne.mockResolvedValue(null);

    const repo = AppDataSource.getRepository(Article);
    vi.mocked(repo.update).mockResolvedValueOnce({
      affected: 0,
      raw: [],
      generatedMaps: [],
    });

    const response = await request(app).delete("/articles/999");

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("error", "Article not found.");
  });
});
