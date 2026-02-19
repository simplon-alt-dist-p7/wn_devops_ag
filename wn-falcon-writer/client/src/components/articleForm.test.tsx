import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import ArticleForm from "./articleForm";

// We mock the article service to avoid making real API calls during tests
vi.mock("../services/article", () => ({
  createArticle: vi.fn(),
  updateArticle: vi.fn(),
}));

// We also mock the toast notifications to prevent actual UI popups during tests
vi.mock("react-hot-toast", () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// We mock the category service to provide predefined categories for the form
vi.mock("../services/category", () => ({
  getCategories: vi.fn(() =>
    Promise.resolve([
      { id: 1, name: "Technologie" },
      { id: 2, name: "Sport" },
    ]),
  ),
}));

describe.skip("ArticleForm", () => {
  // ----- required element test -----
  it("Affiche les messages d'erreur de validation lorsque les champs sont vides", async () => {
    render(<ArticleForm />);

    const submitButton = screen.getByRole("button", { name: /enregistrer/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Le titre est requis/i)).toBeInTheDocument();
      expect(screen.getByText(/Le sous-titre est requis/i)).toBeInTheDocument();
      expect(screen.getByText(/Le chapeau est requis/i)).toBeInTheDocument();
      expect(screen.getByText(/Le contenu est requis/i)).toBeInTheDocument();
    });
  });

  // ----- field interaction test -----
  it("Met à jour l'état du formulaire lorsque l'utilisateur saisit des données", async () => {
    render(<ArticleForm />);

    const titleInput = screen.getByPlaceholderText(/Titre de l’article/i);
    const subtitleInput = screen.getByPlaceholderText(/Sous-titre/i);
    const summaryInput = screen.getByPlaceholderText(/Phrase d’introduction/i);
    const contentInput = screen.getByPlaceholderText(/Contenu de l’article/i);
    const categorySelect = screen.getByRole("combobox");

    fireEvent.change(titleInput, { target: { value: "Dark Plageuis" } });
    fireEvent.change(subtitleInput, {
      target: {
        value: "Connaissez vous l'histoire tragique de Dark Plageuis le sage ?",
      },
    });
    fireEvent.change(summaryInput, {
      target: { value: "Ce n'est pas une histoire que raconte les jedi" },
    });
    fireEvent.change(contentInput, {
      target: {
        value:
          "C'est une légende Sith. Dark Plagueis était un Seigneur Noir des Sith, tellement puissant et tellement sage qu'il pouvait utiliser la Force pour influencer les midi-chloriens afin de créer la vie… Il avait une telle connaissance du côté obscur qu'il pouvait même empêcher ceux qu'il aimait de mourir. Le côté obscur de la Force est un chemin vers de nombreuses capacités que certains considèrent comme contre nature. Il est devenu si puissant… la seule chose dont il avait peur était de perdre son pouvoir, ce qu'il a fini par faire, bien sûr. Malheureusement, il a tout appris à son apprenti, puis son apprenti l'a tué dans son sommeil. Ironique. Il pouvait sauver les autres de la mort, mais pas lui-même.",
      },
    });
    fireEvent.change(categorySelect, { target: { value: "1" } });

    await waitFor(() => {
      expect(titleInput).toHaveValue("Dark Plageuis");
      expect(subtitleInput).toHaveValue(
        "Connaissez vous l'histoire tragique de Dark Plageuis le sage ?",
      );
      expect(summaryInput).toHaveValue(
        "Ce n'est pas une histoire que raconte les jedi",
      );
      expect(contentInput).toHaveValue(
        "C'est une légende Sith. Dark Plagueis était un Seigneur Noir des Sith, tellement puissant et tellement sage qu'il pouvait utiliser la Force pour influencer les midi-chloriens afin de créer la vie… Il avait une telle connaissance du côté obscur qu'il pouvait même empêcher ceux qu'il aimait de mourir. Le côté obscur de la Force est un chemin vers de nombreuses capacités que certains considèrent comme contre nature. Il est devenu si puissant… la seule chose dont il avait peur était de perdre son pouvoir, ce qu'il a fini par faire, bien sûr. Malheureusement, il a tout appris à son apprenti, puis son apprenti l'a tué dans son sommeil. Ironique. Il pouvait sauver les autres de la mort, mais pas lui-même.",
      );
      expect(categorySelect).toHaveValue("1");
    });
  });

  // ----- article submission test -----
  it("Soumet le formulaire de création d'un article correctement", async () => {
    const { createArticle } = await import("../services/article");
    render(<ArticleForm />);

    await waitFor(() => {
      const options = screen.getAllByRole("option");
      expect(options.length).toBeGreaterThan(1);
    });

    const titleInput = screen.getByPlaceholderText(/Titre de l’article/i);
    const categorySelect = screen.getByRole("combobox");

    fireEvent.change(titleInput, { target: { value: "Titre" } });
    fireEvent.change(screen.getByPlaceholderText(/Sous-titre/i), {
      target: { value: "Sous-titre" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Phrase d’introduction/i), {
      target: { value: "Intro" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Contenu de l’article/i), {
      target: { value: "Contenu" },
    });
    fireEvent.change(categorySelect, { target: { value: "1" } });

    const submitButton = screen.getByRole("button", { name: /enregistrer/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(createArticle).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "Titre",
          subtitle: "Sous-titre",
          summary: "Intro",
          content: "Contenu",
          category: { id: 1 },
        }),
      );
    });
  });
});
