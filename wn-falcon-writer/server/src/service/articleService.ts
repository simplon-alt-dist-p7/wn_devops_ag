import { AppDataSource } from "../config/data-source.js";
import { Article } from "../entity/article.js";
import {IsNull} from "typeorm";

const repo = () => AppDataSource.getRepository(Article);

/**
 * Lire tous les articles (triés DESC)
 */
export async function findArticles() {
    return repo()
        .createQueryBuilder("article")
        .leftJoinAndSelect("article.category", "category")
        .orderBy("article.updated_at", "DESC", "NULLS LAST")
        .addOrderBy("article.published_at", "DESC")
        .take(10)
        .getMany();
}

/**
 * Lire un article par id
 */
export async function findArticleById(articleId: number) {
    return repo().findOne({
    where: { id: articleId }, 
    relations: ["category"],
    });
}

/**
 * Créer un article
 */
export async function createOneArticle(payload: Partial<Article>) {
    const articleRepository = repo();
    const newArticle = articleRepository.create({...payload, updated_at: null});
    return articleRepository.save(newArticle);
}

/**
 * Modifier un article (PATCH)
 */
export async function updateArticleById(
    articleId: number,
    payload: Partial<Article>
) {
    const articleRepository = repo();

    const article = await articleRepository.findOneBy({ id: articleId });
    if (!article) return null;

    const { deleted_at, ...safePayload } = payload as any;

    articleRepository.merge(article, safePayload);
    article.updated_at = new Date();
    return articleRepository.save(article);
}


/**
 * Soft delete d’un article (DELETE)
 */
export async function softDeleteArticleById(articleId: number) {
    const articleRepository = repo();

    const result = await articleRepository.update(
        { id: articleId, deleted_at: IsNull() },
        { deleted_at: new Date() }
    );

    return !!result.affected && result.affected > 0;
}
