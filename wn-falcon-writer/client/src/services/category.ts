import { API_URL } from "../config/api";
import type { Category } from "../types/category";
import toast from "react-hot-toast";

const CATEGORIES_URL = `${API_URL}/categories`;

// GET all categories
export const getCategories = async (): Promise<Category[]> => {
    try {
        const res = await fetch(CATEGORIES_URL);

        if (!res.ok) {
            throw new Error("Erreur lors de la récupération des catégories");
        }

        return res.json();
    } catch (err) {
        toast.error("Erreur lors de la récupération des catégories");
        throw err;
    }
};