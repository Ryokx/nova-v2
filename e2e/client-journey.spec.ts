import { test, expect } from "@playwright/test";

test.describe("Client Journey", () => {
  test("homepage loads with Nova branding", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("h1")).toContainText("Nova");
    await expect(page.locator("text=Trouver mon artisan")).toBeVisible();
  });

  test("login page renders correctly", async ({ page }) => {
    await page.goto("/login");
    await expect(page.locator("h1")).toContainText("Connexion");
    await expect(page.locator("text=Continuer avec Google")).toBeVisible();
    await expect(page.locator("text=Continuer avec Apple")).toBeVisible();
    await expect(page.locator("input[placeholder='Email']")).toBeVisible();
    await expect(page.locator("input[placeholder='Mot de passe']")).toBeVisible();
    await expect(page.locator("text=Mode démo")).toBeVisible();
  });

  test("signup page has role selector", async ({ page }) => {
    await page.goto("/signup");
    await expect(page.locator("h1")).toContainText("Créer un compte");
    await expect(page.locator("text=Particulier")).toBeVisible();
    await expect(page.locator("text=Artisan")).toBeVisible();
  });

  test("signup shows artisan fields when artisan selected", async ({ page }) => {
    await page.goto("/signup");
    await page.click("text=Artisan");
    await expect(page.locator("text=Informations entreprise")).toBeVisible();
    await expect(page.locator("input[placeholder='Raison sociale']")).toBeVisible();
    await expect(page.locator("input[placeholder='SIRET']")).toBeVisible();
  });

  test("artisans page loads with search and filters", async ({ page }) => {
    await page.goto("/artisans");
    await expect(page.locator("h1")).toContainText("Trouver un artisan");
    await expect(page.locator("text=Plombier")).toBeVisible();
    await expect(page.locator("text=Électricien")).toBeVisible();
    await expect(page.locator("input[placeholder*='Rechercher']")).toBeVisible();
  });

  test("landing artisan page loads", async ({ page }) => {
    await page.goto("/devenir-partenaire");
    await expect(page.locator("h1")).toContainText("Zéro impayé");
    await expect(page.locator("text=Questions fréquentes")).toBeVisible();
  });

  test("landing client page loads with animated title", async ({ page }) => {
    await page.goto("/comment-ca-marche");
    await expect(page.locator("h1")).toContainText("Vous cherchez");
    await expect(page.locator("text=Comment ça marche")).toBeVisible();
  });

  test("legal pages load", async ({ page }) => {
    await page.goto("/cgu");
    await expect(page.locator("h1")).toContainText("Conditions Générales");

    await page.goto("/confidentialite");
    await expect(page.locator("h1")).toContainText("Politique de Confidentialité");

    await page.goto("/mentions-legales");
    await expect(page.locator("h1")).toContainText("Mentions Légales");
  });

  test("navigation links work", async ({ page }) => {
    await page.goto("/");
    // Footer links
    await expect(page.locator("footer")).toContainText("Nova");
    await expect(page.locator("footer")).toContainText("© 2026 Nova SAS");
  });
});
