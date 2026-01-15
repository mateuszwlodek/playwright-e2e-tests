// @ts-nocheck
import { test, expect, request } from "@playwright/test";
import { loginLocators } from "../locators/login/login.locators.js";
import { testSalonData } from "../testData/salonData.js";
import generalCommands from "../support/generalCommands.js";

const staffEmailDev = testSalonData.DEV.EU.SINGLE_BRANCH.IRELAND_SALON.staff[0].email;
const staffPasswordDev = process.env.DEV_staffPassword;
const staffEmailProd = testSalonData.PROD.US.MULTI_BRANCH.QA_AUTOMATION_SALON.staff[0].email;
const staffPasswordProd = process.env.PROD_staffPassword;

test("Check login @dev @login", async ({ page }) => {
  await page.goto("/");
  await page.locator(loginLocators.emailInput).click();
  await page.locator(loginLocators.emailInput).fill(staffEmailDev);
  await page.locator(loginLocators.passwordInput).click();
  await page.locator(loginLocators.passwordInput).fill(staffPasswordDev);
  await page.locator(loginLocators.signInButton).click();
  await expect(page).toHaveURL(
    "a/" + testSalonData.DEV.EU.SINGLE_BRANCH.IRELAND_SALON.ACCOUNT_ID + "/appointments"
  );
});

test("Check login @prod @login @smoke", async ({ page, request }) => {
  await generalCommands.loginByPassProd(page, request, staffEmailProd, staffPasswordProd);
  await generalCommands.loadFeatureFlags(page);
});
