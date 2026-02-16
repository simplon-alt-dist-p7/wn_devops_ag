import { Request, Response } from "express";
import { findCategories } from "../service/categoryService.js";

//GET all categories
export async function getCategories(_req: Request, res: Response) {
    try {
        const categories = await findCategories();
        return res.status(200).json(categories);
    } catch (err) {
        console.error("getAllCategories error:", err);
        return res.status(500).json({ error: "Internal server error." });
    }
}