import type { Request, Response } from "express";
import {
  createOneArticle,
  findArticleById,
  findArticles,
  updateArticleById,
  softDeleteArticleById,
} from "../service/articleService.js";

/**
 * GET /articles
 */
export const getAllArticles = async (_req: Request, res: Response) => {
  try {
    const articles = await findArticles();
    return res.status(200).json(articles);
  } catch (err) {
    console.error("getAllArticles error:", err);
    return res.status(500).json({ error: "Internal server error." });
  }
};

/**
 * GET /articles/:articleId
 */
export const getArticleById = async (req: Request, res: Response) => {
  const articleId = Number(req.params.articleId);

  if (!Number.isInteger(articleId) || articleId <= 0) {
    return res.status(400).json({ error: "Invalid articleId." });
  }

  try {
    const article = await findArticleById(articleId);

    if (!article) {
      return res.status(404).json({ error: "Article not found." });
    }

    return res.status(200).json(article);
  } catch (err) {
    console.error("getArticleById error:", err);
    return res.status(500).json({ error: "Internal server error." });
  }
};

/**
 * POST /articles
 */
export const createArticle = async (req: Request, res: Response) => {
  if (
    !req.body.title ||
    !req.body.subtitle ||
    !req.body.summary ||
    !req.body.content
  ) {
    return res
      .status(400)
      .json({ error: "Données invalides : champs obligatoires manquants." });
  }
  try {
    const savedArticle = await createOneArticle(req.body);
    return res.status(201).json(savedArticle);
  } catch (err) {
    console.error("createArticle error:", err);
    return res.status(500).json({ error: "Internal server error." });
  }
};

/**
 * PATCH /articles/:articleId
 */
export const editArticle = async (req: Request, res: Response) => {
  const articleId = Number(req.params.articleId);

  if (!Number.isInteger(articleId) || articleId <= 0) {
    return res.status(400).json({ error: "Invalid articleId." });
  }

  try {
    const updated = await updateArticleById(articleId, req.body);

    if (!updated) {
      return res.status(404).json({ error: "Article not found." });
    }

    return res.status(200).json(updated);
  } catch (err) {
    console.error("editArticle error:", err);
    return res.status(500).json({ error: "Internal server error." });
  }
};

/**
 * DELETE /articles/:articleId
 */
export const deleteArticle = async (req: Request, res: Response) => {
  const articleId = Number(req.params.articleId);

  if (!Number.isInteger(articleId) || articleId <= 0) {
    return res.status(400).json({ error: "Invalid articleId." });
  }

  try {
    const deleted = await softDeleteArticleById(articleId);

    if (!deleted) {
      return res.status(404).json({ error: "Article not found." });
    }

    return res.sendStatus(204);
  } catch (err) {
    console.error("deleteArticle error:", err);
    return res.status(500).json({ error: "Internal server error." });
  }
};
