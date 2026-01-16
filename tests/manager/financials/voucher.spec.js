// @ts-nocheck
import { test, expect, request } from "@playwright/test";
import { testSalonData } from "../../../testData/salonData.js";
import generalCommands from "../../../support/generalCommands.js";
import voucherRequests from "../../../support/requests/voucher.requests.js";

// Test configuration
const TEST_CONFIG = {
  staffEmailDev: testSalonData.DEV.EU.SINGLE_BRANCH.IRELAND_SALON.staff[0].email,
  staffPasswordDev: process.env.DEV_staffPassword,
  testAutomationClientID: "LZEAhkK0pRZZPJ7agub91A",
};

// Helper functions
const getCurrentDate = () => {
  return new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    new Date().getDate()
  )
    .toJSON()
    .slice(0, 10);
};

const getFutureDate = () => {
  return new Date(
    new Date().getFullYear() + 1,
    new Date().getMonth(),
    new Date().getDate()
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
test("Create new voucher with GraphQL @dev @voucher", async ({ page, request }) => {
  // Setup
  await generalCommands.loginByPassDev(page, request, TEST_CONFIG.staffEmailDev, TEST_CONFIG.staffPasswordDev);
  await generalCommands.loadFeatureFlags(page);

  // Test data preparation
  const voucherData = createVoucherData();
  const token = await generalCommands.getAccessToken(page);
  
  // Execute request
  const response = await voucherRequests.createVoucher(request, token, voucherData);
  
  // Assertions
  await expect(response.ok()).toBeTruthy();
  await expect(response.status()).toBe(200);
});
