import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import ArticleForm from "./articleForm";
import type { Article } from "../types/article";

describe("ArticleForm", () => {
  // ----- required element test -----
  it("Displays error messages when form is submitted without required fields", async () => {
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
  it("Updates form state when user enters data", async () => {
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
  it("Submits the article form correctly", async () => {
    const articleService = await import("../services/article");
    const createArticleMock = vi
      .spyOn(articleService, "createArticle")
      .mockResolvedValue({
        id: 1,
        title: "Titre",
        subtitle: "Sous-titre",
        summary: "Intro",
        content: "Contenu",
        category: { id: 1 },
      } as Article);
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
      expect(createArticleMock).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "Titre",
          subtitle: "Sous-titre",
          summary: "Intro",
          content: "Contenu",
          category: { id: 1 },
        }),
      );
    });
    createArticleMock.mockRestore();
  });
});
