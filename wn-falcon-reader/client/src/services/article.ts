import type { Article } from "../types/article";
import { API_URL } from "../config/api";
import type { ArticlesProps } from "../types/articlesProps";

export const getArticles = async ({ category, page, limit }: ArticlesProps) => {
  try {
    const params = new URLSearchParams();

    if (page) params.append("page", page.toString());
    if (limit) params.append("limit", limit.toString());
    if (category) params.append("category", category);

    const url = `${API_URL}/articles?${params.toString()}`;
    console.log(url);
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Erreur lors de la récupération des articles");
    }

    if (!category) {
      const response = await fetch(`${API_URL}/articles`);
      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des articles");
      }
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Articles non trouvés", error);
    throw error;
  }
};

export async function fetchArticleById(id: number): Promise<Article> {
  const res = await fetch(`${API_URL}/articles/${id}`);
  if (!res.ok) {
    let message = `HTTP ${res.status}`;
    try {
      const data = await res.json();
      message = data?.error ?? message;
    } catch {}
    throw new Error(message);
  }

  return res.json();
}
