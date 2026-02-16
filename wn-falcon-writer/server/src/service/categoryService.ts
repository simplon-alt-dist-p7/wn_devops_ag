import { AppDataSource } from "../config/data-source.js";
import { Category } from "../entity/category.js";

const repo = () => AppDataSource.getRepository(Category);

/**
 * Lire tous les articles (triés DESC)
 */
export async function findCategories() {
    return repo().find({
        relations: ["articles"], 
    });
}

/**
 * Lire un article par id
 */
export async function findCategoryById(categoryId: number) {
    return repo().findOne({
    where: { id: categoryId }, 
    relations: ["articles"],
    });
}