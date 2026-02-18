import { test, expect } from "@playwright/test";
import { uploadDicomFiles } from "./helpers/upload-helper";
import path from "path";

test.describe("Upload Page", () => {
  test.setTimeout(60000);

  test.beforeEach(async ({ page }) => {
    // Must be set before goto so the flag is available on first load
    await page.addInitScript(() => {
      (window as any).__PLAYWRIGHT_TEST__ = true;
    });
    await page.goto("/");
  });

  test("should display the upload page", async ({ page }) => {
    await expect(page.locator("h2")).toContainText("Upload DICOM Files");
    await expect(page.getByText("Drop DICOM folder here")).toBeVisible();
  });

  test("should upload DICOM files and navigate to preview", async ({
    page,
    browserName,
  }) => {
    // Temporary skip Firefox
    test.skip(
      browserName === "firefox",
      "Temporary skip Firefox has issues with directory uploads in CI"
    );

    await uploadDicomFiles(page);

    // Wait for the upload to be processed
    await expect(page.getByText("Successfully loaded")).toBeVisible({
      timeout: 10000,
    });

    const continueButton = page.getByRole("button", {
      name: /Continue to 3D Preview/i,
    });
    await expect(continueButton).toBeEnabled();
    await continueButton.click();

    await expect(page).toHaveURL("/preview", { timeout: 10000 });
    await expect(page.getByRole("heading", { name: /3D Preview/i })).toBeVisible({
      timeout: 10000,
    });
  });

  test("should show patient information after upload", async ({
    page,
    browserName,
  }) => {
    test.skip(
      browserName === "firefox",
      "Firefox has issues with directory uploads in CI"
    );

    await uploadDicomFiles(page);

    await expect(page.getByText("Successfully loaded")).toBeVisible();
  });

  test("should show error for non-DICOM files (folder upload)", async ({ page }) => {
    await page.goto("/");

    const fileInput = page.locator('input[type="file"]');

    //folder containing invalid file(s)
    const invalidFolderPath = path.join(__dirname, "fixtures/Invalid_Folder");

    await fileInput.setInputFiles(invalidFolderPath);

    await expect(page.getByText("Error")).toBeVisible();
  });
});