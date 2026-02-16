import { AppDataSource } from '../config/data-source.js';
import { Favorite } from '../entity/Favorite.js';

const repo = AppDataSource.getRepository(Favorite);

// Ajouter un article aux favoris
export async function addToFavorite(articleId: number) {
    try {
        let favorite = await repo.findOneBy({ idArticle: articleId })
        if (favorite) {
            favorite.date = new Date();
        } else {
            favorite = repo.create({
                idArticle: articleId,
                date: new Date(),
            });
        }
        const savedFavorite = await repo.save(favorite);
        await AppDataSource.query('REFRESH MATERIALIZED VIEW reader.mv_articles;')
        return savedFavorite;
    } catch (error) {
        throw new Error(`Erreur lors de l'ajout du favori: ${error}`);
    }
}

// Suppression logique : on met la date à null

export async function removeFromFavorite(articleId: number) {
    try {
        const result = await repo.update(
            { idArticle: articleId },
            { date: null }
        );
        await AppDataSource.query('REFRESH MATERIALIZED VIEW reader.mv_articles;')
        return result.affected !== undefined && result.affected > 0;
    } catch (error) {
        throw new Error(`Erreur lors de la suppression du favori: ${error}`);
    }
}