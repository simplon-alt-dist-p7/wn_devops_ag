import type { Request, Response } from "express";
import {findCategoryById, findCategories} from "../service/categoryService.js";


/**
 * GET /categories
 */
export const getAllCategories = async (_req: Request, res: Response) => {
    try {
        const categories = await findCategories();
        return res.status(200).json(categories);
    } catch (err) {
        console.error("getAllCategories error:", err);
        return res.status(500).json({ error: "Internal server error." });
    }
};

/**
 * GET /categories/:categoryId
 */
export const getCategoryById = async (req: Request, res: Response) => {
    const categoryId = Number(req.params.categoryId);

    if (!Number.isInteger(categoryId) || categoryId <= 0) {
        return res.status(400).json({ error: "Invalid categoryId." });
    }

    try {
        const category = await findCategoryById(categoryId);

    if (!category) {
        return res.status(404).json({ error: "Category not found." });
    }

    return res.status(200).json(category);
    } catch (err) {
    console.error("getCategoryById error:", err);
    return res.status(500).json({ error: "Internal server error." });
    }
};