import { Page, expect } from "@playwright/test";
import path from "path";
import fs from "fs";

/**
 * Helper function to upload DICOM files from the test fixtures
 * @param page - Playwright page object
 */
export async function uploadDicomFiles(page: Page): Promise<void> {
  const dicomFolder = path.join(__dirname, "../fixtures/dicom/Test_CT_Dicom");

  const fileChooserPromise = page.waitForEvent("filechooser");

  await page
    .locator("div")
    .filter({ hasText: /Drop DICOM folder here/ })
    .first()
    .click();

  const fileChooser = await fileChooserPromise;
  await fileChooser.setFiles(dicomFolder);

  await expect(
    page.getByText(/Successfully loaded \d+ DICOM files/)
  ).toBeVisible({
    timeout: 45000,
  });
}
