import { test, expect } from "@playwright/test";

test.describe("Admin Journey", () => {
  test("admin page redirects unauthenticated users", async ({ page }) => {
    await page.goto("/admin");
    // Should be redirected to login (middleware)
    await page.waitForURL(/login/);
    await expect(page.locator("h1")).toContainText("Connexion");
  });

  test("sitemap.xml is accessible", async ({ page }) => {
    const response = await page.goto("/sitemap.xml");
    expect(response?.status()).toBe(200);
  });

  test("robots.txt is accessible", async ({ page }) => {
    const response = await page.goto("/robots.txt");
    expect(response?.status()).toBe(200);
  });
});
