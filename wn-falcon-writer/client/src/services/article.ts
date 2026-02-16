import toast from "react-hot-toast";
import type { Article } from "../types/article";
import { API_URL } from "../config/api";
import type { DeepPartial } from "react-hook-form";
import type {ArticleFormData} from "../components/articleForm.tsx";

const ARTICLES_URL = `${API_URL}/articles`;

// GET all articles
export const getArticles = async (): Promise<Article[]> => {
    try {
        const res = await fetch(ARTICLES_URL);

        if (!res.ok) {
            throw new Error("Erreur lors de la récupération des articles");
        }

        return res.json();
    } catch (err) {
        toast.error("Erreur lors de la récupération des articles");
        throw err;
    }
};

// GET article by id
export async function fetchArticleById(id: number): Promise<Article> {
    try {
        const res = await fetch(`${ARTICLES_URL}/${id}`);

        if (!res.ok) {
            let message = `HTTP ${res.status}`;
            try {
                const data = await res.json();
                message = data?.error ?? data?.message ?? message;
            } catch {
                // ignore json parse error
            }
            throw new Error(message);
        }

        return res.json();
    } catch (err) {
        toast.error((err as Error).message);
        throw err;
    }
}

// POST create article
export async function createArticle(data: DeepPartial<Article>): Promise<Article> {
    try {
        const res = await fetch(ARTICLES_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        if (!res.ok) {
            let message = `HTTP ${res.status}`;
            try {
                const payload = await res.json();
                message =
                    payload?.error ??
                    payload?.message ??
                    "Erreur lors de la création de l’article";
            } catch {
                message = "Erreur lors de la création de l’article";
            }
            throw new Error(message);
        }

        return res.json();
    } catch (err) {
        toast.error((err as Error).message);
        throw err;
    }
}

// PATCH update article
export async function updateArticle(
    id: number,
    data: ArticleFormData
): Promise<Article> {
    try {
        const res = await fetch(`${ARTICLES_URL}/${id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        if (!res.ok) {
            let message = `HTTP ${res.status}`;
            try {
                const payload = await res.json();
                message =
                    payload?.error ??
                    payload?.message ??
                    "Erreur lors de la mise à jour de l’article";
            } catch {
                message = "Erreur lors de la mise à jour de l’article";
            }
            throw new Error(message);
        }

        return res.json();
    } catch (err) {
        toast.error((err as Error).message);
        throw err;
    }
}

// DELETE soft delete article (deleted_at = NOW())
export async function deleteArticle(id: number): Promise<void> {
    try {
        const res = await fetch(`${ARTICLES_URL}/${id}`, {
            method: "DELETE",
        });

        if (!res.ok && res.status !== 204) {
            let message = `HTTP ${res.status}`;
            try {
                const payload = await res.json();
                message =
                    payload?.error ?? payload?.message ?? "Erreur lors de la suppression de l’article";
            } catch {
                message = "Erreur lors de la suppression de l’article";
            }
            throw new Error(message);
        }
    } catch (err) {
        toast.error((err as Error).message);
        throw err;
    }
}
