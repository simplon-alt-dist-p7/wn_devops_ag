CREATE SCHEMA IF NOT EXISTS writer;

CREATE TABLE writer.t_category (
    id_category INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    category_name VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE writer.t_articles(
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

CREATE TRIGGER article_change_trigger
AFTER INSERT OR UPDATE ON writer.t_articles
FOR EACH ROW
EXECUTE FUNCTION writer.notify_article_change();

INSERT INTO
    writer.t_category (category_name)
VALUES ('International'),
    ('Actualités locales'),
    ('Économie'),
    ('Sciences et technologies'),
    ('Divertissement'),
    ('Sports'),
    ('Santé');

INSERT INTO
    writer.t_articles (
        title,
        subtitle,
        published_at,
        summary,
        content,
        id_category
    )
VALUES
    (
        'Développement Full-Stack en 2025',
        'Les technologies qui révolutionnent le web moderne',
        '2025-12-15 10:30:00+01',
        'Découvrez les stacks full-stack les plus performants pour 2025 avec PostgreSQL, React et Docker.',
        'Le développement full-stack évolue rapidement. PostgreSQL reste le choix n°1 pour les bases de données relationnelles grâce à ses performances et sa conformité SQL standard. React domine le frontend avec ses hooks et Next.js pour le SSR. Docker et Kubernetes simplifient les déploiements. L''IA générative transforme les workflows dev... (987 caractères)',
        4
    ),
    (
        'PostgreSQL vs MySQL : Le grand débat',
        'Quelle base choisir pour votre projet ?',
        '2025-12-14 14:20:00+01',
        'Comparaison complète des deux SGBD les plus populaires du marché.',
        'PostgreSQL excelle en JSON, full-text search et géospatial. MySQL reste plus simple pour les petits projets. Benchmarks montrent PostgreSQL 30% plus rapide sur les jointures complexes... (1245 caractères)',
        5
    ),
    (
        'Docker en production : Best Practices',
        'Évitez les pièges courants du container',
        '2025-12-13 09:15:00+01',
        'Guide pratique pour des déploiements Docker fiables et sécurisés.',
        'Healthchecks, multi-stage builds, secrets management et orchestrateurs. Exemple docker-compose.yml optimisé pour API + PostgreSQL... (2156 caractères)',
        1
    ),
    (
        'TypeScript : Pourquoi adopter dès maintenant',
        'Sécurité des types pour JavaScript',
        '2025-12-12 16:45:00+01',
        'Les avantages concrets de TypeScript sur des projets réels.',
        'Réduction de 40% des bugs runtime, autocomplétion VS Code, refactoring sûr. Migration progressive depuis JS vanilla... (1893 caractères)',
        4
    ),
    (
        'API REST sécurisées avec JWT',
        'Authentification moderne pour vos endpoints',
        '2025-12-11 11:00:00+01',
        'Implémentez une authentification JWT robuste en 30 minutes.',
        'Middleware Express.js, refresh tokens, CORS sécurisé, rate limiting. Code complet avec PostgreSQL et bcrypt... (3421 caractères)',
        4
    );