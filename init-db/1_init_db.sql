CREATE SCHEMA IF NOT EXISTS writer;
CREATE SCHEMA IF NOT EXISTS reader;

CREATE TABLE IF NOT EXISTS writer.t_category (
    id_category INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    category_name VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS writer.t_articles(
    id_article INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    title VARCHAR(300) UNIQUE NOT NULL,
    subtitle VARCHAR(300) NOT NULL,
    updated_at TIMESTAMP NULL,
    published_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    summary VARCHAR(1000) NOT NULL,
    content VARCHAR(10000) NOT NULL,
    id_category INTEGER NOT NULL,
    CONSTRAINT fk_article_category FOREIGN KEY (id_category) REFERENCES writer.t_category (id_category) ON DELETE CASCADE
);

CREATE OR REPLACE FUNCTION writer.notify_article_change()
RETURNS trigger AS $$
BEGIN
    PERFORM pg_notify('articles_update', NEW.id_article::text);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS article_change_trigger ON writer.t_articles;
CREATE TRIGGER article_change_trigger
AFTER INSERT OR UPDATE ON writer.t_articles
FOR EACH ROW
EXECUTE FUNCTION writer.notify_article_change();

INSERT INTO writer.t_category (category_name)
VALUES ('International'), ('Actualités locales'), ('Économie'), 
       ('Sciences et technologies'), ('Divertissement'), ('Sports'), ('Santé')
ON CONFLICT (category_name) DO NOTHING;

CREATE TABLE IF NOT EXISTS reader.t_comments (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    article_id INTEGER NOT NULL,
    description VARCHAR(1000) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_comments_article FOREIGN KEY (article_id) REFERENCES writer.t_articles(id_article) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS reader.t_article_favorite (
   id_favorite INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
   date TIMESTAMP,
   id_article INTEGER NOT NULL UNIQUE,
   CONSTRAINT fk_article_favorite FOREIGN KEY(id_article) REFERENCES writer.t_articles(id_article)
); 

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