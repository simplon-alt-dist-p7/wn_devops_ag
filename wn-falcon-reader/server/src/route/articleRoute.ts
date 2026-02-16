import { Router } from "express";
import {
  getArticles,
  getArticleById,
} from "../controller/articleController.js";

const router = Router();

router.get("/", getArticles);
router.get("/:articleId", getArticleById);

export default router;
