import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchArticleById } from "../services/article";
import type { Article } from "../types/article";
import ArticleForm, { type ArticleFormData } from "../components/articleForm.tsx";

export default function EditArticle() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const articleId = Number(id);

    const [article, setArticle] = useState<Article | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!Number.isInteger(articleId) || articleId <= 0) {
            setArticle(null);
            setLoading(false);
            return;
        }

        setLoading(true);

        fetchArticleById(articleId)
            .then((data) => setArticle(data))
            .catch((err) => {
                console.error(err);
                setArticle(null);
            })
            .finally(() => setLoading(false));
    }, [articleId]);

    if (loading) return <p className="p-8">Chargement…</p>;
    if (!article) return <p className="p-8">Article introuvable</p>;

    const defaultValues: ArticleFormData = {
        title: article.title,
        subtitle: article.subtitle,
        summary: article.summary,
        content: article.content,
        category: article.category,
    };

    return (
        <ArticleForm
            articleId={articleId}
            defaultValues={defaultValues}
            deletedAt={article.deleted_at}
            onClose={() => navigate(`/articles/${articleId}`)}
        />
    );
}
