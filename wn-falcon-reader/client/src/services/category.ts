import { API_URL } from "../config/api";

export const getCategories = async () => {
    try {
    const response = await fetch(`${API_URL}/categories`);
    const data = await response.json();
    return data;
    } catch (error) {
    console.error("Catégories non trouvées");
    }
};