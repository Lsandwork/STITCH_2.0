import { expect, test } from "@playwright/test";

test.describe("Stitch smoke tests", () => {
  test("demo login reaches dashboard with Continue Crocheting", async ({ page }) => {
    await page.goto("/auth/login");

    await expect(page.getByRole("heading", { name: "Welcome back" })).toBeVisible();
    await page.getByRole("button", { name: "Sign in" }).click();

    await expect(page).toHaveURL("/");
    await expect(
      page.getByRole("link", { name: "Continue Crocheting" }),
    ).toBeVisible();
  });

  test("pattern generator form is present", async ({ page }) => {
    await page.goto("/create/pattern");

    await expect(
      page.getByRole("heading", { name: "AI Pattern Generator" }),
    ).toBeVisible();
    await expect(page.getByLabel("Project description")).toBeVisible();
    await expect(page.getByLabel("Project type")).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Generate pattern" }),
    ).toBeVisible();
  test("vocabulary page renders with search", async ({ page }) => {
    await page.goto("/vocab?category=crochet");

    await expect(page.getByRole("heading", { name: "Vocab" })).toBeVisible();
    await expect(
      page.getByPlaceholder("Search a term, abbreviation, stitch, or technique…"),
    ).toBeVisible();
    await expect(page.getByRole("tab", { name: /Crochet/i })).toBeVisible();
  });
});
