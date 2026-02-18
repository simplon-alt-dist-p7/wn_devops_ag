import { Link } from "react-router-dom";
import type { Article } from "../types/article";
import ToggleFavorite from "./toogleIsFavorite";
import { CategoryBadge } from "./categoryBadge";

interface ArticleProps {
  article: Article;
}

export default function ArticleCard({ article }: ArticleProps) {
  const formattedDate = new Date(article.published_at).toLocaleDateString(
    "fr-FR",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    },
  );

  return (
    <Link to={`/articles/${article.id}`}>
      <div className="bg-secondary rounded-xl shadow-md p-6 hover:shadow-lg transition h-[12rem] min-w-[270px] flex flex-col justify-around gap-3 sm:text-sm lg:text-lg max-w-full sm:max-w-[370px] mx-auto relative group">
        <ToggleFavorite
          articleId={article.id}
          initialIsFavorite={article.is_favorite}
        />
        <div>
          <CategoryBadge category={article.category_name} />
          <h1 className="text-tertiary font-bold line-clamp-1 mt-2">
            {article.title}
          </h1>
          <h2 className="text-primary line-clamp-1">{article.subtitle}</h2>
          <p className="text-tertiary opacity-60 text-sm">{formattedDate}</p>
        </div>

        <div className="absolute bottom-4 right-4 flex items-center gap-1.5 bg-white/50 px-2.5 py-1 rounded-full border border-black/5 group-hover:bg-white transition-colors">
          <span className="text-xs opacity-100">💬</span>
          <span className="text-xs font-bold text-tertiary">
            {article.comment_count ?? "?"}
          </span>
        </div>
      </div>
    </Link>
  );
}
