// @ts-nocheck
import { test, expect, request } from "@playwright/test";
import { loginLocators } from "../../../locators/login/login.locators.js";
import { testSalonData } from "../../../testData/salonData.js";
import generalCommands from "../../../support/generalCommands.js";

const staffEmailDev = testSalonData.DEV.EU.SINGLE_BRANCH.IRELAND_SALON.staff[0].email;
const staffPasswordDev = process.env.DEV_staffPassword;

test("Create a break @dev @break", async ({ page, request }) => {
  await generalCommands.loginByPassDev(page, request, staffEmailDev, staffPasswordDev);
  await generalCommands.loadFeatureFlags(page);
});
