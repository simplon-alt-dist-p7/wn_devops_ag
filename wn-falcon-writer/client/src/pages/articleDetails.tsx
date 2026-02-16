import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchArticleById } from "../services/article";
import type { Article } from "../types/article";
import EditArticleButton from "../components/buttons/editArticleButton";
import BackButton from "../components/buttons/backButton";

type FormattedDates = {
    published: string;
    updated: string | null;
};

export default function ArticleDetails() {
    const { id } = useParams();
    const articleId = Number(id);
    const navigate = useNavigate();

    const [article, setArticle] = useState<Article | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!Number.isInteger(articleId) || articleId <= 0) {
            setError("ID d’article invalide");
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);

        fetchArticleById(articleId)
            .then((data) => setArticle(data))
            .catch((err) => {
                console.error(err);
                setError("Impossible de charger l’article.");
                setArticle(null);
            })
            .finally(() => setLoading(false));
    }, [articleId]);

    const labels = useMemo<FormattedDates | null>(() => {
        if (!article) return null;

        const format: Intl.DateTimeFormatOptions = {
            day: "2-digit",
            month: "long",
            year: "numeric",
        };

        const publishedDate = new Date(article.published_at);
        const updatedDate = article.updated_at ? new Date(article.updated_at) : null;

        return {
            published: isNaN(publishedDate.getTime())
                ? ""
                : publishedDate.toLocaleDateString("fr-FR", format),
            updated:
                updatedDate && !isNaN(updatedDate.getTime())
                    ? updatedDate.toLocaleDateString("fr-FR", format)
                    : null,
        };
    }, [article]);

    const isDeleted = !!(article as any)?.deleted_at;
    const pageClass = "min-h-screen bg-secondary font-serif text-primary";

    if (loading) {
        return (
            <div className={`${pageClass} flex items-center justify-center px-4`}>
                <p className="opacity-80">Chargement de l’article…</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className={`${pageClass} flex items-center justify-center px-4`}>
                <div className="max-w-md w-full bg-white/80 border border-black/10 rounded-xl p-6 shadow-sm">
                    <p className="text-lg font-semibold">Erreur</p>
                    <p className="mt-2 opacity-80">{error}</p>

                    <div className="mt-6">
                        <BackButton to="/articles" />
                    </div>
                </div>
            </div>
        );
    }

    if (!article) {
        return (
            <div className={`${pageClass} flex items-center justify-center px-4`}>
                <div className="text-center">
                    <p className="opacity-80">Aucun article trouvé.</p>

                    <div className="mt-4">
                        <BackButton to="/articles" />
                    </div>
                </div>
            </div>
        );
    }

    const paragraphs = article.content
        .split("\n")
        .map((p) => p.trim())
        .filter(Boolean);

    return (
        <main className={`${pageClass} py-12 px-4`}>
            <div className="max-w-3xl mx-auto">
                <div className="mb-6 flex items-center justify-between gap-4">
                    <BackButton to="/articles" />

                    <EditArticleButton
                        onClick={() => navigate(`/articles/edit/${article.id}`)}
                        label="Modifier l'article"
                    />
                </div>

                <article className="bg-white/90 border border-black/10 rounded-2xl shadow-sm p-8">
                    {isDeleted && (
                        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">
              <span className="text-sm font-semibold">
                Cet article a été supprimé.
              </span>
                        </div>
                    )}

                    <div className="mx-auto max-w-2xl text-center">
                        <h1 className="text-3xl sm:text-4xl font-bold leading-tight text-tertiary">
                            {article.title}
                        </h1>

                        <h2 className="mt-3 text-lg sm:text-xl text-tertiary opacity-80">
                            {article.subtitle}
                        </h2>

                        <div className="mt-5 inline-flex flex-wrap items-center justify-center gap-x-10 gap-y-2">
                            <p className="text-sm text-tertiary opacity-60">
                                Publié le {labels?.published}
                            </p>

                            {labels?.updated && (
                                <p className="text-sm text-tertiary opacity-60">
                                    (Mis à jour le {labels.updated})
                                </p>
                            )}
                        </div>

                        <p className="mt-5 text-sm opacity-60 text-left">
                            Catégorie : {article.category?.category_name ?? "Sans catégorie"}
                        </p>
                    </div>

                    <hr className="my-6 border-black/10" />

                    <p className="text-base sm:text-lg font-semibold opacity-90">
                        {article.summary}
                    </p>

                    <div className="mt-6 space-y-4 text-base leading-relaxed opacity-90 text-justify">
                        {paragraphs.length > 0 ? (
                            paragraphs.map((p, idx) => <p key={idx}>{p}</p>)
                        ) : (
                            <p className="whitespace-pre-line">{article.content}</p>
                        )}
                    </div>
                </article>
            </div>
        </main>
    );
}
