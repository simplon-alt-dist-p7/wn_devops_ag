import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchArticleById } from "../services/article";
import { fetchCommentsByArticleId } from "../services/comments";
import ToggleFavorite from "../components/toogleIsFavorite";
import type { Article } from "../types/article";
import type { Comment } from "../types/comment";
import CommentCard from "../components/commentCard";
import CommentForm from "../components/commentForm";
import { CategoryBadge } from "../components/categoryBadge";

export default function ArticlePage() {
  const { id } = useParams();
  const articleId = Number(id);

  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [comments, setComments] = useState<Comment[]>([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (!Number.isInteger(articleId) || articleId <= 0) {
      setError("ID d’article invalide");
      setLoading(false);
      return;
    }

    setLoading(true);
    setCommentsLoading(true);
    setError(null);

    fetchArticleById(articleId)
      .then(setArticle)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));

    fetchCommentsByArticleId(articleId)
      .then(setComments)
      .catch((e) => console.error("Erreur coms:", e))
      .finally(() => setCommentsLoading(false));
  }, [articleId]);

  const publishedLabel = useMemo(() => {
    if (!article) return "";
    return new Date(article.published_at).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }, [article]);

  const pageClass = "bg-secondary font-serif text-primary";
  const primaryButtonClass =
    "inline-flex items-center gap-2 rounded-lg bg-primary px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-semibold hover:opacity-95 transition-opacity text-secondary";

  if (loading) {
    return (
      <div className={`${pageClass} flex items-center justify-center px-4`}>
        <p className="opacity-80 animate-pulse">Chargement de l’article…</p>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className={`${pageClass} flex items-center justify-center px-4`}>
        <div className="max-w-md w-full bg-white/80 border border-black/10 rounded-xl p-6 shadow-sm text-center">
          <p className="text-lg font-semibold">
            {error || "Article introuvable"}
          </p>
          <Link to="/articles" className={`mt-6 ${primaryButtonClass}`}>
            ← Retour aux articles
          </Link>
        </div>
      </div>
    );
  }

  const paragraphs = article.content
    .split("\n")
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <>
      <header className="mb-10"></header>
      <main className={`${pageClass} py-12 px-4`}>
        <div className="max-w-3xl mx-auto">
          <div className="mb-6">
            <Link
              to="/articles"
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
            >
              ← Retour
            </Link>
          </div>

          <article className="relative bg-white/90 border border-black/10 rounded-2xl shadow-sm p-8 text-primary">
            <ToggleFavorite
              articleId={article.id}
              initialIsFavorite={article.is_favorite}
            />
            <CategoryBadge category={article.category_name} />
            <h1 className="text-3xl sm:text-4xl font-bold leading-tight text-tertiary mt-6">
              {article.title}
            </h1>
            <h2 className="mt-3 text-lg sm:text-xl text-tertiary opacity-80">
              {article.subtitle}
            </h2>
            <p className="mt-5 text-sm text-tertiary opacity-60">
              Publié le {publishedLabel}
            </p>
            <hr className="my-6 border-black/10" />
            <p className="text-base sm:text-lg font-semibold opacity-90">
              {article.summary}
            </p>
            <div className="mt-6 space-y-4 text-base leading-relaxed opacity-90">
              {paragraphs.map((p, idx) => (
                <p key={idx}>{p}</p>
              ))}
            </div>
          </article>

          <section className="mt-12">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-tertiary flex items-center gap-3">
                <span>Commentaires</span>
                <span className="bg-tertiary/10 text-tertiary text-xs px-2 py-0.5 rounded-full border border-tertiary/20">
                  {comments.length}
                </span>
              </h3>

              {!showForm && (
                <button
                  onClick={() => setShowForm(true)}
                  className={primaryButtonClass}
                >
                  + Ajouter un commentaire
                </button>
              )}
            </div>

            {showForm && (
              <CommentForm
                articleId={articleId}
                primaryButtonClass={primaryButtonClass}
                onCancel={() => setShowForm(false)}
                onCommentAdded={(newCom) =>
                  setComments((prev) => [newCom, ...prev])
                }
              />
            )}

            {commentsLoading ? (
              <p className="text-sm opacity-60 italic text-center py-4">
                Chargement des commentaires...
              </p>
            ) : comments.length > 0 ? (
              <div className="space-y-4">
                {comments.map((comment) => (
                  <CommentCard key={comment.id} comment={comment} />
                ))}
              </div>
            ) : (
              <div className="bg-white/30 border border-dashed border-black/10 rounded-xl p-8 text-center">
                <p className="text-sm opacity-60 italic">
                  Aucun commentaire pour le moment. Soyez le premier à réagir !
                </p>
              </div>
            )}
          </section>
        </div>
      </main>
    </>
  );
}
