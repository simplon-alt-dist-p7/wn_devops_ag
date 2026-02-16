import { AppDataSource } from "../config/data-source.js";
import { ArticleMV } from "../entity/ArticleMV.js";

// GET categories from the materialized view
export async function findCategories() {
  const rows = await AppDataSource.getRepository(ArticleMV)
    .createQueryBuilder("mv")
    .select("DISTINCT mv.category_name", "name")
    .where("mv.category_name IS NOT NULL")
    .orderBy("mv.category_name", "ASC")
    .getRawMany();

  return rows.map(r => r.name);
}