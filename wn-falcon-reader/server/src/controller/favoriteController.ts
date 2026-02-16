import { Request, Response } from 'express';
import { addToFavorite, removeFromFavorite} from '../service/favoriteService.js';

// Ajoute un article aux favoris
// POST /favorite/:id
 
export const addFavorite = async (req: Request, res: Response) => {
    try {
        const articleId = parseInt(req.params.id);
        const favorite = await addToFavorite(articleId);
        return res.status(201).json(favorite);
    } catch (error) {        
        return res.status(500).json({ message: error instanceof Error ? error.message : "Erreur pour ajouter l'article aux favoris" });
    }
};

// Supprime un article des favoris
// DELETE /favorite/:id

export const removeFavorite = async (req: Request, res: Response) => {
    try {
        const articleId = parseInt(req.params.id);
        const success = await removeFromFavorite(articleId);
        return res.status(204).send();
    } catch (error) {
        return res.status(500).json({ message: error instanceof Error ? error.message : "Erreur pour retirer l'article des favoris" });
    }
};