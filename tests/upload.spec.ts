import { test, expect } from "@playwright/test";
import { uploadDicomFiles } from "./helpers/upload-helper";

test.describe("Upload Page", () => {
  test.setTimeout(60000);

  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("should display the upload page", async ({ page }) => {
    await expect(page.locator("h2")).toContainText("Upload DICOM Files");
    await expect(page.getByText("Drop DICOM folder here")).toBeVisible();
  });

  test("should upload DICOM files and navigate to preview", async ({
    page,
  }) => {
    await uploadDicomFiles(page);

    await page.getByRole("button", { name: /Continue to 3D Preview/i }).click();

    await expect(page).toHaveURL("/preview");
    await expect(page.locator("h2")).toContainText("3D Preview");
  });

  test("should show patient information after upload", async ({ page }) => {
    await uploadDicomFiles(page);

    await expect(page.getByText("Successfully loaded")).toBeVisible();
  });
});
