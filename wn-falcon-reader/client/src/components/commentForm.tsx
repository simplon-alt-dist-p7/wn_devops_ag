import { useState } from "react";
import { postComment } from "../services/comments";
import type { Comment } from "../types/comment";

interface CommentFormProps {
  articleId: number;
  onCommentAdded: (newComment: Comment) => void;
  onCancel: () => void;
  primaryButtonClass: string;
}

export default function CommentForm({
  articleId,
  onCommentAdded,
  onCancel,
  primaryButtonClass,
}: CommentFormProps) {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsSubmitting(true);
    try {
      const savedComment = await postComment(articleId, content);

      onCommentAdded(savedComment);

      setContent("");
      onCancel();
    } catch (err) {
      console.error(err);
      alert("Erreur lors de l'envoi du commentaire");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-8 bg-white/50 p-4 rounded-xl border border-black/5 animate-in fade-in slide-in-from-top-2"
    >
      <textarea
        autoFocus
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Votre commentaire..."
        className="w-full p-3 rounded-lg border border-black/10 bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none text-primary"
        rows={3}
      />
      <div className="mt-2 flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-semibold opacity-100 sm:opacity-60 hover:opacity-100 text-primary transition-opacity"
        >
          Annuler
        </button>
        <button
          type="submit"
          disabled={isSubmitting || !content.trim()}
          className={`${primaryButtonClass} disabled:opacity-50`}
        >
          {isSubmitting ? "Envoi..." : "Publier"}
        </button>
      </div>
    </form>
  );
}
