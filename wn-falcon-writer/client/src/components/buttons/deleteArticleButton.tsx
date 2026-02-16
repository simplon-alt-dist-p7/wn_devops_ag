import toast from "react-hot-toast";
import { Trash2 } from "lucide-react";
import { deleteArticle } from "../../services/article.ts";

interface DeleteArticleButtonProps {
    articleId: number;
    onDeleted?: (articleId: number) => void;
}

export default function DeleteArticleButton({
                                                articleId,
                                                onDeleted,
                                            }: DeleteArticleButtonProps) {
    const handleDelete = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();

        const confirmed = window.confirm("Confirmer la suppression de cet article ?");
        if (!confirmed) return;

        try {
            await deleteArticle(articleId);
            toast.success("Article supprimé");
            onDeleted?.(articleId);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <button
            type="button"
            onClick={handleDelete}
            title="Supprimer l’article"
            aria-label="Supprimer l’article"
            className="shrink-0 rounded-lg border border-black/20 p-2 hover:bg-red-50 transition"
        >
            <Trash2 className="h-4 w-4 text-red-600" />
        </button>
    );
}
