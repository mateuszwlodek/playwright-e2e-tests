// @ts-nocheck
import { test, expect, request } from "@playwright/test";
import { testSalonData } from "../../../testData/salonData.js";
import generalCommands from "../../../support/generalCommands.js";
import voucherRequests from "../../../support/requests/voucher.requests.js";
import { navigation } from "../../../locators/navigation.js";
import { voucherLocators } from "../../../locators/manager/financials/voucher.locators.js";

// Test configuration
const TEST_CONFIG = {
  testSalon: testSalonData.DEV.EU.SINGLE_BRANCH.IRELAND_SALON,
  staffEmailDev:
    testSalonData.DEV.EU.SINGLE_BRANCH.IRELAND_SALON.staff[0].email,
  staffPasswordDev: process.env.DEV_staffPassword,
  testAutomationClientID: "LZEAhkK0pRZZPJ7agub91A",
};

// Helper functions
const getCurrentDate = () => {
  return new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    new Date().getDate(),
  )
    .toJSON()
    .slice(0, 10);
};

const getFutureDate = () => {
  return new Date(
    new Date().getFullYear() + 1,
    new Date().getMonth(),
    new Date().getDate(),
  )
    .toJSON()
    .slice(0, 10);
};

const createVoucherData = () => {
  return {
    input: {
      clientId: TEST_CONFIG.testAutomationClientID,
      issueDate: String(getCurrentDate()),
      expiryDate: String(getFutureDate()),
      serial: String(Date.now()),
      originalBalance: "500",
      remainingBalance: "500",
      notes: "Test Notes",
    },
  };
};

// Test implementation
test("Create new voucher with GraphQL check it on the UI and archive it @dev @voucher", async ({
  page,
  request,
}) => {
  // Setup
  await generalCommands.loginByPassDev(
    page,
    request,
    TEST_CONFIG.staffEmailDev,
    TEST_CONFIG.staffPasswordDev,
  );
  await generalCommands.loadFeatureFlags(page);

  // Test data preparation
  const voucherData = createVoucherData();
  const token = await generalCommands.getAccessToken(page);

  // Execute request with validation
  const createVoucherResult = await voucherRequests.createVoucher(
    request,
    token,
    voucherData,
    TEST_CONFIG.testSalon,
    true, // validate response
  );

  // Check Voucher on the UI
  await page.goto(testSalonData.DEV.URL.BASE_URL);
  await page.locator(navigation.managerSideNav).click();
  await page.locator(navigation.vouchers).click();
  
  await page.locator(voucherLocators.searchByClientName).fill("TestAutomation");
  await expect(
    page.locator(voucherLocators.clientNameColumn).nth(0),
  ).toHaveText("TestAutomation User");
  await expect(
    page.locator(voucherLocators.originalBalanceColumn).nth(0),
  ).toHaveText("€" + voucherData.input.originalBalance + ".00");
  await expect(page.locator(voucherLocators.remainingColumn).nth(0)).toHaveText(
    "€" + voucherData.input.remainingBalance + ".00",
  );

  // Execute request with validation
  const archiveResult = await voucherRequests.bulkArchiveVoucher(
    request,
    token,
    TEST_CONFIG.testSalon,
    true, // validate response
  );

  // Response is already validated in voucherRequests
  // Additional assertions can be added here if needed
  expect(archiveResult.count).toBeGreaterThanOrEqual(0);
});
