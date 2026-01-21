import { test, expect } from "@playwright/test";
import { leadFormLocators } from "../../locators/marketing/leadform.locators.js";

// Validate that user can submit lead form on OB
test("Validate that a lead can submit the form on OB @dev @marketing", async ({
  page,
}) => {
  const unique = new Date().getTime() + "";
  const LeadFirstName = "Lead" + unique;
  const LeadLastName = "Surname" + unique;
  const MobilePhoneNumber = "0" + unique;
  const Email = unique + "@gmail.com";

  // Wait for the form to load
  const formLoadPromise = page.waitForResponse(
    (response) =>
      response.url().includes("/consultations/form") &&
      response.status() === 200
  );

  await page.goto(
    "https://dev.phorest.com/salon/testuser-4524/book/consultations/form?lead_source=ONLINE_BOOKING",
    { timeout: 3000 }
  );
  await formLoadPromise;

  // Verify page loaded
  await expect(page.getByText("Request a Call Back")).toBeVisible();
  await page.waitForTimeout(3000);

  // Fill in first name
  await page
    .locator(leadFormLocators.firstNameInput)
    .waitFor({ state: "visible", timeout: 100 });
  await page.locator(leadFormLocators.firstNameInput).fill(LeadFirstName);

  // Fill in last name
  await page
    .locator(leadFormLocators.lastNameInput)
    .waitFor({ state: "visible", timeout: 100 });
  await page.locator(leadFormLocators.lastNameInput).fill(LeadLastName);

  // Fill in phone number
  await page
    .locator(leadFormLocators.phoneInput)
    .waitFor({ state: "visible", timeout: 100 });
  await page.locator(leadFormLocators.phoneInput).fill(MobilePhoneNumber);

  // Fill in email
  await page
    .locator(leadFormLocators.emailInput)
    .waitFor({ state: "visible", timeout: 100 });
  await page.locator(leadFormLocators.emailInput).fill(Email);

  // Select email option (clicking the second image)
  await page.locator(leadFormLocators.emailOptionImage).nth(leadFormLocators.emailOptionImageIndex).click();

  // Add a note
  await page.locator(leadFormLocators.noteInput).click();
  await page
    .locator(leadFormLocators.noteInput)
    .fill(
      "Hello, can you tell me more about the packages you offer at your salon?"
    );

  // Submit the form
  await page.locator(leadFormLocators.submitButton).click();

  // Assert that lead form is submitted and user can see the return button
  await page.waitForTimeout(2000);
  await expect(page.locator(leadFormLocators.goToHomePageButton)).toHaveText(
    "Return to Home Page"
  );
});
