import { API_URL } from "../config/api";

export const fetchCommentsByArticleId = async (articleId: number) => {
  try {
    const response = await fetch(`${API_URL}/articles/${articleId}/comments`);

    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Impossible de récupérer les commentaires :", error);
    return [];
  }
};

export const postComment = async (articleId: number, content: string) => {
  const response = await fetch(`${API_URL}/articles/${articleId}/comments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ description: content }),
  });
  if (!response.ok) throw new Error("Erreur lors de l'envoi");
  return response.json();
};
