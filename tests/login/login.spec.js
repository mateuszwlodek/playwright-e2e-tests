// @ts-nocheck
import { test, expect, request } from "@playwright/test";
import { loginLocators } from "../../locators/login/login.locators.js";
import { testSalonData } from "../../testData/salonData.js";
import generalCommands from "../../support/generalCommands.js";

const staffEmailDev = testSalonData.DEV.EU.SINGLE_BRANCH.IRELAND_SALON.staff[0].email;
const staffPasswordDev = process.env.DEV_staffPassword;
const staffEmailProd = testSalonData.PROD.US.MULTI_BRANCH.QA_AUTOMATION_SALON.BRANCH_QA_AUTOMATION_DEMO.staff[0].email;
const staffPasswordProd = process.env.PROD_staffPassword;

test("Check ByPass login on Dev @dev @login @smoke", async ({ page, request }) => {
  await generalCommands.loginByPassDev(page, request, staffEmailDev, staffPasswordDev);
  await generalCommands.loadFeatureFlags(page);
  await expect(page).toHaveURL(
    testSalonData.DEV.URL.BASE_URL + "/a/" + testSalonData.DEV.EU.SINGLE_BRANCH.IRELAND_SALON.ACCOUNT_ID + "/appointments"
  );
});

test("Check manual login on Dev @dev @login", async ({ page }) => {
  await page.goto(testSalonData.DEV.URL.BASE_URL);
  await page.locator(loginLocators.emailInput).fill(staffEmailDev);
  await page.locator(loginLocators.passwordInput).fill(staffPasswordDev);
  await page.locator(loginLocators.signInButton).click();
  await expect(page).toHaveURL(
    testSalonData.DEV.URL.BASE_URL + "/a/" + testSalonData.DEV.EU.SINGLE_BRANCH.IRELAND_SALON.ACCOUNT_ID + "/appointments"
  );
});

test("Check ByPasslogin on Prod @prod @login @smoke", async ({ page, request }) => {
  await generalCommands.loginByPassProd(page, request, staffEmailProd, staffPasswordProd);
  await expect(page).toHaveURL(
    testSalonData.PROD.URL.BASE_URL + "/a/" + testSalonData.PROD.US.MULTI_BRANCH.QA_AUTOMATION_SALON.BRANCH_QA_AUTOMATION_DEMO.ACCOUNT_ID + "/appointments"
  );
});

test("Check manual login on Prod @prod @login", async ({ page }) => {
  await page.goto(testSalonData.PROD.URL.BASE_URL);
  await page.locator(loginLocators.emailInput).fill(staffEmailProd);
  await page.locator(loginLocators.passwordInput).fill(staffPasswordProd);
  await page.locator(loginLocators.signInButton).click();
  await expect(page).toHaveURL(
    testSalonData.PROD.URL.BASE_URL + "/a/" + testSalonData.PROD.US.MULTI_BRANCH.QA_AUTOMATION_SALON.BRANCH_QA_AUTOMATION_DEMO.ACCOUNT_ID + "/appointments"
  );
});