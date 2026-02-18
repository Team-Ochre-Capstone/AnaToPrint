import { test, expect } from "@playwright/test";

test.describe("Navigation", () => {
  test("should redirect to upload when accessing preview without data", async ({
    page,
  }) => {
    await page.goto("/preview");

    await expect(page.getByText("No file loaded")).toBeVisible();
    await expect(
      page.getByText("Please upload a CT scan before previewing")
    ).toBeVisible();

    await page.getByRole("button", { name: /Go to Upload/i }).click();

    await expect(page).toHaveURL("/");
  });

  test("should redirect to upload when accessing export without data", async ({
    page,
  }) => {
    await page.goto("/export");

    await expect(page.getByText("No file loaded")).toBeVisible();
    await expect(
      page.getByText("Please upload a CT scan before exporting")
    ).toBeVisible();

    await page.getByRole("button", { name: /Go to Upload/i }).click();

    await expect(page).toHaveURL("/");
  });

  test("should navigate to settings page", async ({ page }) => {
    await page.goto("/");

    const settingsLink = page.getByRole("link", { name: /Settings/i });

    if (await settingsLink.isVisible()) {
      await settingsLink.click();
      await expect(page).toHaveURL("/settings");
    }
  });

  //Checking for content within pages
  test('About page content visible', async ({ page }) => {
    await page.goto('http://localhost:5173/about');
    await expect(page.locator('text=AnaToPrint')).toBeVisible();
    await expect(page.locator('text=Group Members')).toBeVisible();
    await expect(page.locator('text=Client')).toBeVisible();
  });

});
