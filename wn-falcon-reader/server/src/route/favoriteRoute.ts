import { Router } from "express";
import { addFavorite, removeFavorite } from "../controller/favoriteController.js";

const router = Router();

router.post("/:id", addFavorite);
router.delete("/:id", removeFavorite);

export default router;