import { Request, Response } from "express";
import { findArticles, findArticleById } from "../service/articleService.js";

export async function getArticles(req: Request, res: Response) {
  try {
    const category = req.query.category as string | undefined;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;
    const result = await findArticles(category, page, limit);

    return res.status(200).json(result);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erreur serveur" });
  }
}

export async function getArticleById(req: Request, res: Response) {
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
}
