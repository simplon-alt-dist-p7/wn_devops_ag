import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { describe, it, expect } from "vitest";
import ArticleCard from "./articleCard";

// Using a mock here is simpler and faster than calling the real API
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
  it("Displays all required elements on the article card", () => {
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
  it("Creates a link to the article detail page", () => {
    render(
      <BrowserRouter>
        <ArticleCard article={mockArticle} />
      </BrowserRouter>,
    );

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/articles/1");
  });

  // ----- Date formatting test -----
  it("Displays the formatted date correctly", () => {
    render(
      <BrowserRouter>
        <ArticleCard article={mockArticle} />
      </BrowserRouter>,
    );

    expect(screen.getByText(/1 janvier 2024/i)).toBeInTheDocument();
  });
});
