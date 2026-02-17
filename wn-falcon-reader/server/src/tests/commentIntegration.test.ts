import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import app from "../app.js";

const { vi_actions } = vi.hoisted(() => ({
  vi_actions: {
    findOne: vi.fn(),
    getMany: vi.fn(),
    save: vi.fn(),
    query: vi.fn(),
  },
}));

vi.mock("../config/data-source.js", () => ({
  AppDataSource: {
    initialize: vi.fn().mockResolvedValue(true),
    getRepository: vi.fn().mockReturnValue({
      /* --- GET --- */
      find: vi_actions.getMany,
      findOne: vi_actions.findOne,
      findOneBy: vi_actions.findOne,
      createQueryBuilder: vi.fn().mockReturnThis(),
      leftJoinAndSelect: vi.fn().mockReturnThis(),
      orderBy: vi.fn().mockReturnThis(),
      addOrderBy: vi.fn().mockReturnThis(),
      take: vi.fn().mockReturnThis(),
      getMany: vi_actions.getMany,

      /* --- POST --- */
      create: vi.fn().mockImplementation((d) => d),
      save: vi_actions.save,
      query: vi_actions.query.mockResolvedValue(true),

      merge: vi
        .fn()
        .mockImplementation((dest, src) => Object.assign(dest, src)),
    }),
  },
}));

describe("Comments Integration", () => {
  // ----- Get should Success -----
  it("should get comments for a specific article", async () => {
    vi_actions.getMany.mockResolvedValue([
      { id: 1, description: "Commentaire test", article_id: 1 },
    ]);

    const response = await request(app).get("/articles/1/comments");

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body[0].description).toBe("Commentaire test");
  });

  // ----- Get should fail -----
  it("should return 500 if there's an error fetching comments", async () => {
    vi_actions.getMany.mockRejectedValue(new Error("DB error"));
    const response = await request(app).get("/articles/1/comments");

    expect(response.status).toBe(500);
    expect(response.body.error).toBe("Internal server error.");
  });

  // ----- Post should success -----
  it("should return 201 and create a new comment", async () => {
    const payload = { description: "Nouveau commentaire" };

    vi_actions.save.mockResolvedValue({
      id: 1,
      description: payload.description,
      article_id: 1,
    });

    vi_actions.query.mockResolvedValue([]);

    const response = await request(app)
      .post("/articles/1/comments")
      .send(payload);

    expect(response.status).toBe(201);
    expect(response.body.description).toBe("Nouveau commentaire");
  });

  // ----- Post should fail -----
  it("should return 400 if description is missing", async () => {
    const response = await request(app).post("/articles/1/comments").send({});

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("Le message est requis.");
  });
});
