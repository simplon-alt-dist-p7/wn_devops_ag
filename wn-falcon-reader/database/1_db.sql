CREATE SCHEMA IF NOT EXISTS reader;

CREATE TABLE IF NOT EXISTS reader.t_comments (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    article_id INTEGER NOT NULL,
    description VARCHAR(1000) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    CONSTRAINT fk_comments_article 
        FOREIGN KEY (article_id) 
        REFERENCES writer.t_articles(id_article) 
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS reader.t_article_favorite (
   id_favorite INTEGER primary key generated always as identity,
   date timestamp,
   id_article INTEGER NOT null unique,
   CONSTRAINT fk_article_favorite
        FOREIGN KEY(id_article)
        REFERENCES writer.t_articles(id_article)
); 

