import { AppDataSource } from "../config/data-source.js";
import { Comment } from "../entity/Comment.js";

const repo = AppDataSource.getRepository(Comment);

export async function findCommentsByArticle(articleId: number) {
  return repo.find({
    where: { article_id: articleId },
    order: { created_at: "DESC" },
  });
}

export async function createComment(data: {
  article_id: number;
  description: string;
}) {
  const repo = AppDataSource.getRepository(Comment);
  const newComment = repo.create({
    ...data,
    created_at: new Date(),
  });

  const savedComment = await repo.save(newComment);

  await repo.query("REFRESH MATERIALIZED VIEW reader.mv_articles");

  return savedComment;
}
