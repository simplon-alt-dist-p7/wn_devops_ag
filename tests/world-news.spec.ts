import { test, expect } from "@playwright/test";

const WRITER_URL = "http://localhost:8080";
const READER_URL = "http://localhost:8081";

const uniqueTitle = `Breaking News - ${Date.now()}`;

test.describe.serial("Workflow Complet World News", () => {
  // --- Writer test ---
  test("Writer : Création d'un article", async ({ page }) => {
    await page.goto(WRITER_URL);

    await page.getByRole("button", { name: /nouvel article/i }).click();

    await page.getByPlaceholder(/titre de l’article/i).fill(uniqueTitle);
    await page.getByPlaceholder(/sous-titre/i).fill("Test E2E automatisé");
    await page
      .getByPlaceholder(/phrase d’introduction/i)
      .fill("Ceci est un test de bout en bout.");
    await page
      .getByPlaceholder(/contenu de l’article/i)
      .fill("Contenu généré par Playwright.");

    await page.getByRole("combobox").selectOption({ label: "International" });

    await page.getByRole("button", { name: /enregistrer/i }).click();

    await expect(page.getByText(/article créé avec succès/i)).toBeVisible();

    await expect(page.getByText(uniqueTitle)).toBeVisible();
  });

  // --- Reader test ---
  test("Reader : Consultation et Recherche", async ({ page }) => {
    await page.goto(READER_URL);
    await page.reload();

    const articleCard = page.getByText(uniqueTitle);
    await expect(articleCard).toBeVisible({ timeout: 10000 });

    const searchInput = page.getByPlaceholder(/rechercher/i);
    if (await searchInput.isVisible()) {
      await searchInput.fill(uniqueTitle);
      await expect(page.locator("article")).toContainText(uniqueTitle);
    }

    await articleCard.click();
    await expect(page.locator("h1")).toContainText(uniqueTitle);
    await expect(page).toHaveURL(/.*article/);
  });
});
