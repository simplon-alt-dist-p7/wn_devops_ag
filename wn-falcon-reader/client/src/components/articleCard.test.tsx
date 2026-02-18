import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { describe, it, expect } from "vitest";
import ArticleCard from "./articleCard";

describe("ArticleCard Component", () => {
  const mockArticle = {
    id: 1,
    title: "Titre de l'article",
    subtitle: "Sous-titre de l'article",
    summary: "Résumé de l'article",
    content: "Contenu de l'article",
    published_at: "2024-01-01T12:00:00Z",
    comment_count: 5,
    comments: [],
    category_name: "Technologie",
    is_favorite: false,
  };

  // ----- Required element test -----
  it("affiche le titre, sous-titre et la catégorie présents sur la carte", () => {
    render(
      <BrowserRouter>
        <ArticleCard article={mockArticle} />
      </BrowserRouter>,
    );

    expect(screen.getByText("Titre de l'article")).toBeInTheDocument();
    expect(screen.getByText("Sous-titre de l'article")).toBeInTheDocument();
    expect(screen.getByText("Technologie")).toBeInTheDocument();

    expect(screen.getByText("5")).toBeInTheDocument();
  });

  // ----- Link test -----
  it("contient un lien correct vers le détail de l'article", () => {
    render(
      <BrowserRouter>
        <ArticleCard article={mockArticle} />
      </BrowserRouter>,
    );

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/articles/1");
  });

  // ----- Date formatting test -----
  it("affiche la date formatée correctement en français", () => {
    render(
      <BrowserRouter>
        <ArticleCard article={mockArticle} />
      </BrowserRouter>,
    );

    expect(screen.getByText(/1 janvier 2024/i)).toBeInTheDocument();
  });
});
