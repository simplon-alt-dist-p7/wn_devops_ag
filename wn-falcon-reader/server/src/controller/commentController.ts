import { Request, Response } from "express";
import {
  findCommentsByArticle,
  createComment,
} from "../service/commentService.js";

export async function getArticleComments(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const comments = await findCommentsByArticle(Number(id));
    return res.status(200).json(comments);
  } catch (err) {
    console.error("getArticleComments error:", err);
    return res.status(500).json({ error: "Internal server error." });
  }
}

export async function postComment(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { description } = req.body;

    if (!description) {
      return res.status(400).json({ error: "Le message est requis." });
    }

    const savedComment = await createComment({
      article_id: Number(id),
      description,
    });

    return res.status(201).json(savedComment);
  } catch (err) {
    console.error("postComment error:", err);
    return res
      .status(500)
      .json({ error: "Erreur lors de l'ajout du commentaire." });
  }
}
