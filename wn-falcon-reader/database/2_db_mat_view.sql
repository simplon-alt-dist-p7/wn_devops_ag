DROP MATERIALIZED VIEW IF EXISTS reader.mv_articles;

CREATE MATERIALIZED VIEW reader.mv_articles AS
SELECT
    a.id_article AS id, 
    a.title,
    a.subtitle,
    a.summary,
    a.content,
    a.published_at,
    COUNT(c.id)::INT AS comment_count,
    cat.category_name,
    EXISTS (
        SELECT 1
        FROM reader.t_article_favorite f
        WHERE f.id_article = a.id_article AND f.date IS NOT NULL
    ) AS is_favorite
FROM writer.t_articles a
LEFT JOIN reader.t_comments c ON a.id_article = c.article_id
JOIN writer.t_category AS cat ON cat.id_category = a.id_category
GROUP BY a.id_article, a.title, a.subtitle, a.summary, a.content, a.published_at, cat.category_name
ORDER BY a.published_at DESC;

CREATE UNIQUE INDEX idx_mv_articles_id ON reader.mv_articles(id);

CREATE INDEX ON reader.mv_articles (category_name, published_at);

