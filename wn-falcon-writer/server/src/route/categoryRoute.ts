import { Router } from "express";
import { getAllCategories, getCategoryById } from "../controller/categoryController.js";


const router = Router();

/**
 * GET /categories
 */
router.get("/", getAllCategories);

/**
 * GET /categories/:categoryId
 */
router.get("/:categoryId", getCategoryById);


export default router;