import { test, expect } from "@playwright/test";
import { uploadDicomFiles } from "./helpers/upload-helper";

test.describe("Export Page", () => {
  test.setTimeout(60000);

  test.beforeEach(async ({ page, browserName }) => {
    test.skip(
      browserName === "firefox",
      "Firefox has issues with directory uploads in CI"
    );

    await page.goto("/");
    await uploadDicomFiles(page);

    await page.getByRole("button", { name: /Skip to Export/i }).click();
    await expect(page).toHaveURL("/export");
  });

  test("should display export options", async ({ page }) => {
    await expect(page.locator("h2")).toContainText("Export 3D Model");
    await expect(page.getByText("STL File")).toBeVisible();
    await expect(page.getByText("G-code")).toBeVisible();
    await expect(page.getByText("Coming soon")).toBeVisible();
  });

  test("should allow selecting tissue thresholds", async ({ page }) => {
    await expect(page.getByText("High Density (Bone)").first()).toBeVisible();
    await expect(
      page.getByText("Medium Density (Muscle/Organs/Brain)").first()
    ).toBeVisible();
    await expect(page.getByText("Low Density (Skin)").first()).toBeVisible();

    await page
      .getByText("Medium Density (Muscle/Organs/Brain)")
      .first()
      .click();

    await expect(page.getByText(/Medium Density/).last()).toBeVisible();
  });

  test("should allow custom threshold input", async ({ page }) => {
    await page.getByRole("radio", { name: /Custom/i }).click();

    const customInput = page.locator('input[type="number"]').last();
    await customInput.fill("500");

    await expect(page.getByText(/500 HU \(Custom\)/)).toBeVisible();
  });

  test("should toggle smoothing option", async ({ page }) => {
    const smoothingCheckbox = page.getByRole("checkbox", {
      name: /Apply Smoothing/i,
    });

    await expect(smoothingCheckbox).toBeChecked();

    await smoothingCheckbox.uncheck();
    await expect(smoothingCheckbox).not.toBeChecked();

    await expect(page.getByText("Smoothing: Disabled")).toBeVisible();
  });

  test("should show export progress modal when generating STL", async ({
    page,
  }) => {
    const filenameInput = page.locator('input[type="text"]#filename');
    await filenameInput.fill("test_export");

    const downloadPromise = page.waitForEvent("download", { timeout: 60000 });

    await page.getByRole("button", { name: /Generate & Download/i }).click();

    await expect(page.getByText("Processing 3D Model")).toBeVisible();

    const download = await downloadPromise;
    expect(download.suggestedFilename()).toBe("test_export.stl");
  });

  test("should not allow export without filename", async ({ page }) => {
    const filenameInput = page.locator('input[type="text"]#filename');
    await filenameInput.clear();

    page.on("dialog", async (dialog) => {
      expect(dialog.message()).toContain("Please enter a filename");
      await dialog.accept();
    });

    await page.getByRole("button", { name: /Generate & Download/i }).click();
  });
});
