import { useEffect, useState } from "react";
import { getArticles } from "../services/article";
import type { Article } from "../types/article";
import ArticleCard from "../components/articleCard";
import AddArticleButton from "../components/buttons/addArticleButton.tsx";
import NewArticleForm from "../components/articleForm.tsx";

export default function ArticleList() {
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showNewArticleForm, setShowNewArticleForm] = useState(false);

    const fetchArticles = async () => {
        try {
            setLoading(true);
            setError(null);

            const data = await getArticles();
            setArticles(data);
        } catch (err) {
            console.error(err);
            setError("Impossible de charger les articles.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchArticles();
    }, []);

    const markAsDeleted = (articleId: number) => {
        setArticles((prev) =>
            prev.map((a) =>
                a.id === articleId
                    ? { ...a, deleted_at: a.deleted_at ?? new Date().toISOString() }
                    : a
            )
        );
    };

    if (showNewArticleForm) {
        return (
            <NewArticleForm
                onClose={async () => {
                    setShowNewArticleForm(false);
                    await fetchArticles();
                }}
            />
        );
    }

    return (
        <div className="min-h-screen w-full bg-[#F0F4FF] font-serif text-primary">
            <main className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-10 ">
                <div className="mb-6 flex justify-end">
                    <AddArticleButton setNewArticleForm={setShowNewArticleForm} />
                </div>

                {loading && (
                    <p className="text-center opacity-80">Chargement des articles…</p>
                )}

                {error && (
                    <div className="text-center">
                        <p className="text-red-600 font-semibold">{error}</p>
                    </div>
                )}

                {!loading && !error && (
                    <div className="flex flex-wrap -m-2">
                        {articles.map((article) => (
                            <div key={article.id} className="w-full sm:w-1/2 lg:w-1/3 p-2">
                                <ArticleCard article={article} onDeleted={markAsDeleted} />
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
