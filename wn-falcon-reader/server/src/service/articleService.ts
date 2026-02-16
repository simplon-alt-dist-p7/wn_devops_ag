import { AppDataSource } from "../config/data-source.js";
import { ArticleMV } from "../entity/ArticleMV.js";

export async function findArticles(
  category?: string,
  page: number = 1,
  limit: number = 5,
) {
  const repo = AppDataSource.getRepository(ArticleMV);
  const skip = (page - 1) * limit;

  if (!category && page === 1) {
    const articles = await repo.find({
      order: { published_at: "DESC" },
      take: 10,
    });
    return { data: articles, total: 10, totalPages: 1 };
  }

  const [articles, total] = await repo.findAndCount({
    where: category ? { category_name: category } : {},
    order: { published_at: "DESC" },
    take: limit,
    skip: skip,
  });

  return {
    data: articles,
    total,
    totalPages: Math.ceil(total / limit),
  };
}

export async function findArticleById(articleId: number) {
  const repo = AppDataSource.getRepository(ArticleMV);
  return repo.findOne({ where: { id: articleId } });
}
