import { Link } from "react-router-dom";
import { useMemo } from "react";
import type { Article } from "../types/article";
import DeleteArticleButton from "./buttons/deleteArticleButton";

interface ArticleProps {
    article: Article;
    onDeleted?: (articleId: number) => void;
}

type FormattedDates = {
    published: string;
    updated: string | null;
};

export default function ArticleCard({ article, onDeleted }: ArticleProps) {
    const labels = useMemo<FormattedDates>(() => {
        const format: Intl.DateTimeFormatOptions = {
            day: "2-digit",
            month: "short",
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
    }, [article.published_at, article.updated_at]);

    const isDeleted = article.deleted_at !== null;

    return (
        <Link to={`/articles/${article.id}`} className="block">
            <div
                className={`relative font-serif bg-secondary rounded-xl shadow-md p-6 hover:shadow-lg transition 
        h-[12rem] min-w-[270px] flex flex-col justify-around gap-3 sm:text-sm lg:text-lg 
        max-w-full sm:max-w-[370px] mx-auto cursor-pointer 
        ${isDeleted ? "opacity-60" : ""}`}
            >
                <div className="absolute top-3 right-3 z-10">
                    {!isDeleted ? (
                        <DeleteArticleButton articleId={article.id} onDeleted={onDeleted} />
                    ) : (
                        <span className="text-xs font-semibold px-2 py-1 rounded bg-red-100 text-red-700">
              Supprimé
            </span>
                    )}
                </div>

                <div className="pr-10">
                    <h1 className="text-tertiary font-bold truncate">{article.title}</h1>
                    <h2 className="text-primary truncate">{article.subtitle}</h2>

                    <p className="text-center text-tertiary opacity-60 text-sm mt-2">
                        {labels.published}
                        {labels.updated && (
                            <span className="ml-1">
                                (Mis à jour le {labels.updated})
                          </span>
                        )}
                    </p>

                    <p className="text-center text-tertiary opacity-60 text-sm mt-1">
                        Catégorie : {article.category?.category_name ?? "Sans catégorie"}
                    </p>
                </div>

            </div>
        </Link>
    );
}
