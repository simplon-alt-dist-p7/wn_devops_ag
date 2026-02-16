import { Router } from "express";
import {
  getAllArticles,
  getArticleById,
  createArticle,
  editArticle,
  deleteArticle,
} from "../controller/articleController.js";
import {
  validateArticle,
  validatePatchArticle,
} from "../middleware/articleValidation.js";

const router = Router();

/**
 * GET /articles
 */
router.get("/", getAllArticles);

/**
 * GET /articles/:articleId
 */
router.get("/:articleId", getArticleById);

/**
 * POST /articles
 */
router.post("/", validateArticle, createArticle);

/**
 * PATCH /articles/:articleId
 */
router.patch("/:articleId", validatePatchArticle, editArticle);

/**
 * DELETE /articles/:articleId
 */
router.delete("/:articleId", deleteArticle);

export default router;
