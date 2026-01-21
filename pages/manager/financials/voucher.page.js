import BasePage from '../../base.page.js';
import { navigation } from '../../../locators/navigation.js';
import { voucherLocators } from '../../../locators/manager/financials/voucher.locators.js';
import { expect } from '@playwright/test';

class VoucherPage extends BasePage {
  constructor(page) {
    super(page);
  }

  /**
   * Navigate to vouchers page
   * @param {string} baseUrl - Base URL of the application
   */
  async navigateToVouchers(baseUrl) {
    await this.goto(baseUrl);
    await this.click(navigation.managerSideNav);
    await this.click(navigation.vouchers);
  }

  /**
   * Search for vouchers by client name
   * @param {string} clientName - Client name to search for
   */
  async searchByClientName(clientName) {
    await this.fill(voucherLocators.searchByClientName, clientName);
  }

  /**
   * Verify voucher details in the table
   * @param {Object} voucherData - Voucher data to verify
   * @param {string} expectedClientName - Expected client name (default: "TestAutomation User")
   */
  async verifyVoucherDetails(voucherData, expectedClientName = "TestAutomation User") {
    await expect(
      this.page.locator(voucherLocators.clientNameColumn).nth(0),
    ).toHaveText(expectedClientName);
    
    await expect(
      this.page.locator(voucherLocators.originalBalanceColumn).nth(0),
    ).toHaveText("€" + voucherData.input.originalBalance + ".00");
    
    await expect(
      this.page.locator(voucherLocators.remainingColumn).nth(0),
    ).toHaveText("€" + voucherData.input.remainingBalance + ".00");
  }

  /**
   * Complete flow: Navigate to vouchers, search, and verify
   * @param {string} baseUrl - Base URL of the application
   * @param {string} clientName - Client name to search for
   * @param {Object} voucherData - Voucher data to verify
   * @param {string} expectedClientName - Expected client name (default: "TestAutomation User")
   */
  async navigateSearchAndVerify(baseUrl, clientName, voucherData, expectedClientName = "TestAutomation User") {
    await this.navigateToVouchers(baseUrl);
    await this.searchByClientName(clientName);
    await this.verifyVoucherDetails(voucherData, expectedClientName);
  }
}

export default VoucherPage;
