import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getArticles } from "../services/article";
import type { Article } from "../types/article";
import ArticleCard from "../components/articleCard";

export default function Articles() {
  const [searchParams] = useSearchParams();
  const category = searchParams.get("category") || undefined;
  const [articles, setArticles] = useState<Article[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    setPage(1);
  }, [category]);

  useEffect(() => {
    const fetchArticlesData = async () => {
      setLoading(true);
      try {
        const response = await getArticles({ category, page, limit });

        setArticles(response.data);
        setTotalPages(response.totalPages);
        setTotal(response.total);
      } catch (error) {
        console.error("Erreur lors de la récupération des articles", error);
      } finally {
        setLoading(false);
      }
    };
    fetchArticlesData();
  }, [category, page, limit]);

  return (
    <>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {loading ? (
          <div className="text-center py-20 opacity-50">Chargement...</div>
        ) : (
          <div className="flex flex-wrap mt-4 -mx-2">
            {articles.map((article) => (
              <div key={article.id} className="w-full sm:w-1/2 lg:w-1/3 p-2">
                <ArticleCard article={article} />
              </div>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-12 mb-2">
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="p-2 disabled:opacity-20 text-primary font-bold hover:bg-gray-100 rounded-full w-10 h-10 transition-colors"
            >
              ←
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
              <button
                key={num}
                onClick={() => setPage(num)}
                className={`w-10 h-10 rounded-full text-sm font-bold transition-all ${
                  page === num
                    ? "bg-primary text-white shadow-md"
                    : "hover:bg-gray-100 text-gray-600"
                }`}
              >
                {num}
              </button>
            ))}

            <button
              disabled={page >= totalPages}
              onClick={() => setPage(page + 1)}
              className="p-2 disabled:opacity-20 text-primary font-bold hover:bg-gray-100 rounded-full w-10 h-10 transition-colors"
            >
              →
            </button>
          </div>
        )}
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-10">
        {category && total > 5 && (
          <div className="flex justify-center items-center gap-4 mt-5 pb-5">
            <span className="text-sm font-medium text-gray-500">
              Afficher par :
            </span>
            <div className="flex bg-gray-100 p-1 rounded-lg">
              {[5, 10].map((value) => (
                <button
                  key={value}
                  onClick={() => {
                    setLimit(value);
                    setPage(1);
                  }}
                  className={`px-4 py-1 rounded-md text-sm font-bold transition-all ${
                    limit === value
                      ? "bg-white shadow-sm text-primary"
                      : "text-gray-400"
                  }`}
                >
                  {value}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
