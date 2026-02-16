import { Router } from "express";
import {
  getArticleComments,
  postComment,
} from "../controller/commentController.js";

const router = Router();
router.get("/articles/:id/comments", getArticleComments);
router.post("/articles/:id/comments", postComment);

export default router;
