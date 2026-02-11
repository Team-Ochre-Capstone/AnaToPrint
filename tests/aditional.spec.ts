import { test, expect } from "@playwright/test";
import { uploadDicomFiles } from "./helpers/upload-helper";
import path from "path";

test.describe("Additional Tests – New Scenarios", () => {
  test.setTimeout(60000);

  // -------------------
  // Upload Page Tests
  // -------------------
  test("should show error for non-DICOM files", async ({ page }) => {
    await page.goto("/");

    const fileChooserPromise = page.waitForEvent("filechooser");
    await page.locator("div").filter({ hasText: /Drop DICOM folder here/ }).first().click();

    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles(path.join(__dirname, "../fixtures/Invalid_File.txt"));

    await expect(page.getByText("Invalid DICOM files")).toBeVisible();
  });

  test("should handle multiple uploads gracefully", async ({ page }) => {
    await page.goto("/");

    await uploadDicomFiles(page);

    // Upload a second folder
    const fileChooserPromise = page.waitForEvent("filechooser");
    await page.locator("div").filter({ hasText: /Drop DICOM folder here/ }).first().click();
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles(path.join(__dirname, "../fixtures/Test_CT_Dicom"));

    // Check that success message still appears
    await expect(page.getByText(/Successfully loaded \d+ DICOM files/)).toBeVisible();
  });

  // -------------------
  // Preview Page Tests
  // -------------------
  test("should allow zooming and interacting with 3D model", async ({ page }) => {
    await page.goto("/");
    await uploadDicomFiles(page);
    await page.getByRole("button", { name: /Continue to 3D Preview/i }).click();

    const canvas = page.locator("canvas");
    await canvas.hover();
    await page.mouse.wheel(0, -100); // zoom in
    await page.mouse.wheel(0, 100);  // zoom out

    await expect(canvas).toBeVisible();
  });

  test("should keep patient info visible after 3D interactions", async ({ page }) => {
    await page.goto("/");
    await uploadDicomFiles(page);
    await page.getByRole("button", { name: /Continue to 3D Preview/i }).click();

    const info = page.getByText(/Patient:/);
    await expect(info).toBeVisible();

    const canvas = page.locator("canvas");
    await canvas.hover();
    await page.mouse.move(100, 0); // rotate simulation

    await expect(info).toBeVisible();
  });

  // -------------------
  // Export Page Tests
  // -------------------
  test("should validate custom threshold input boundaries", async ({ page }) => {
    await page.goto("/");
    await uploadDicomFiles(page);
    await page.getByRole("button", { name: /Skip to Export/i }).click();

    await page.getByRole("radio", { name: /Custom/i }).click();
    const input = page.locator('input[type="number"]').last();
    await input.fill("-1000"); // below allowed range

    page.on("dialog", async (dialog) => {
      expect(dialog.message()).toContain("Invalid threshold value");
      await dialog.dismiss();
    });

    await page.getByRole("button", { name: /Generate & Download/i }).click();
  });

  test("should warn if 'Coming soon' export option is clicked", async ({ page }) => {
    await page.goto("/");
    await uploadDicomFiles(page);
    await page.getByRole("button", { name: /Skip to Export/i }).click();

    page.on("dialog", async (dialog) => {
      expect(dialog.message()).toContain("This export option is not yet available");
      await dialog.accept();
    });

    await page.getByText("Coming soon").click();
  });

  // -------------------
  // Settings / Navigation Tests
  // -------------------
  test("should persist smoothing option after reload", async ({ page }) => {
    await page.goto("/");
    await uploadDicomFiles(page);
    await page.getByRole("button", { name: /Skip to Export/i }).click();

    const smoothingCheckbox = page.getByRole("checkbox", { name: /Apply Smoothing/i });
    await smoothingCheckbox.uncheck();
    await page.reload();

    await expect(smoothingCheckbox).not.toBeChecked();
  });

  test("should maintain navigation consistency using browser back/forward", async ({ page }) => {
    await page.goto("/");
    await uploadDicomFiles(page);
    await page.getByRole("button", { name: /Continue to 3D Preview/i }).click();
    await expect(page).toHaveURL("/preview");

    await page.goBack();
    await expect(page).toHaveURL("/");

    await page.goForward();
    await expect(page).toHaveURL("/preview");
  });
});