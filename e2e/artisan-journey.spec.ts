import { test, expect } from "@playwright/test";

test.describe("Artisan Journey", () => {
  test("devenir-partenaire has signup modal", async ({ page }) => {
    await page.goto("/devenir-partenaire");

    // Click signup CTA
    await page.click("text=S'inscrire gratuitement");
    await expect(page.locator("text=Créer votre compte artisan")).toBeVisible();
    await expect(page.locator("text=1 mois du forfait Expert offert")).toBeVisible();

    // Fill step 0
    await page.fill("input[placeholder='Email professionnel']", "test@artisan.fr");
    await page.fill("input[placeholder*='Mot de passe']", "SecurePass1!");
    await page.click("text=Continuer");

    // Step 1 should appear
    await expect(page.locator("text=Vos informations")).toBeVisible();
  });

  test("FAQ items are collapsible", async ({ page }) => {
    await page.goto("/devenir-partenaire");

    // Click first FAQ item
    await page.click("text=Combien coûte Nova pour les artisans ?");
    await expect(page.locator("text=L'inscription est gratuite")).toBeVisible();

    // Click again to close
    await page.click("text=Combien coûte Nova pour les artisans ?");
    await expect(page.locator("text=L'inscription est gratuite")).not.toBeVisible();
  });

  test("simulator section is visible", async ({ page }) => {
    await page.goto("/devenir-partenaire");
    await expect(page.locator("text=Simulateur d'économies")).toBeVisible();
    await expect(page.locator("text=Essentiel")).toBeVisible();
    await expect(page.locator("text=Pro")).toBeVisible();
    await expect(page.locator("text=Expert")).toBeVisible();
  });
});
