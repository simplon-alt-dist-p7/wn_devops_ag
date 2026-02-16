import { useState } from "react";

interface ToggleFavoriteProps {
  articleId: number;
  initialIsFavorite: boolean;
}

export default function ToggleFavorite({ articleId, initialIsFavorite }: ToggleFavoriteProps) {
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite);
  const [isLoading, setIsLoading] = useState(false);

  const handleToggle = async (e: React.MouseEvent) => {
    // Empêche le clic de déclencher le <Link> de la carte
    e.preventDefault();
    e.stopPropagation();

    setIsLoading(true);

    try {
      const method = isFavorite ? "DELETE" : "POST";
      const response = await fetch(`http://localhost:3001/favorite/${articleId}`, {
        method: method,
      });

      if (response.ok) {
        setIsFavorite(!isFavorite);
      }
    } catch (error) {
      console.error("Erreur lors du toggle favori:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isLoading}
      className={`absolute top-3 right-3 text-2xl transition-transform active:scale-90 ${
        isLoading ? "opacity-50 cursor-not-allowed" : "hover:scale-110"
      }`}
      aria-label={isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
    >
      {isFavorite ? "⭐" : "☆"}
    </button>
  );
}