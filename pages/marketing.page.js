import BasePage from './base.page.js';
import { navigation } from '../locators/navigation.js';
import { marketingLocators } from '../locators/marketing/marketing.locators.js';

class MarketingPage extends BasePage {
  constructor(page) {
    super(page);
  }

  /**
   * Get the marketing campaigns iframe
   * @param {number} timeout - Timeout in milliseconds
   * @returns {FrameLocator}
   */
  async getCampaignIframe(timeout = 30000) {
    // Wait for iframe to be attached
    await this.page.waitForSelector(marketingLocators.iframeSelector, { 
      state: 'attached', 
      timeout 
    });
    
    // Small delay for iframe content to load
    await this.page.waitForTimeout(2000); 
    const frame = this.page.frameLocator(marketingLocators.iframeSelector);
    
    // Wait for campaigns breadcrumb to ensure content is ready
    await frame.locator(marketingLocators.campaignsBreadcrumb).waitFor({ 
      state: 'visible', 
      timeout 
    });
    
    return frame;
  }
  /**
   * Navigate to compose email page
   */
  async navigateToComposeEmail() {
    await this.click(navigation.marketingSideNav);
    await this.click(marketingLocators.composeEmailLink);
    await this.waitForURL(/campaigns/, 30000);
  }

  /**
   * Create a blank email campaign
   * @param {string} campaignName - Name for the campaign
   * @param {string} subject - Email subject
   * @param {string} body - Email body text
   */
  async createBlankEmailCampaign(campaignName, subject, body) {
    const frame = await this.getCampaignIframe();
    
    // Verify we're on campaigns page
    await frame.locator(marketingLocators.campaignsBreadcrumb).waitFor({ state: 'visible' });
    
    // Create blank campaign
    await frame.locator(marketingLocators.createBlankButton).click();
    
    // Wait for campaign editor to load
    await this.page.waitForTimeout(10000);
    
    // Look for rename button in iframe
    const renameButtonExists = await frame.locator(marketingLocators.renameCampaignButton)
      .isVisible()
      .catch(() => false);
    
    if(renameButtonExists) {
      await frame.locator(marketingLocators.renameCampaignButton).click();
      
      // Wait for modal to appear on main page
      await this.page.waitForTimeout(10000);
      
      // The input is in iframe with name = "campaign-name"
      const modalInput = frame.locator(marketingLocators.modalCampaignNameInput);
      await modalInput.waitFor({ state: 'visible', timeout: 10000 });
      await modalInput.fill(campaignName);
      
      // Save the modal after renaming the campaign
      const saveButton = frame.locator(marketingLocators.saveButton);
      await saveButton.waitFor({ state: 'visible', timeout: 10000 });
      await saveButton.click();
      // Wait for modal to close
      await this.page.waitForTimeout(2000);
    }
    
    // Set subject of the email campaign
    await this.fillContentEditableInFrame(frame, marketingLocators.subjectInput, subject);

    // Set body of the email campaign
    await this.fillContentEditableInFrame(frame, marketingLocators.textBlock, body);
  }

  /**
   * Preview the email campaign
   */
  async previewCampaign() {
    const frame = await this.getCampaignIframe();
    await frame.locator(marketingLocators.previewEmailButton).click();
  }

  /**
   * Select recipients for campaign
   * @param {string} recipientName - 
   */
  async selectRecipients(recipientName) {
    const frame = await this.getCampaignIframe();
    
    // Preview first if not already done
    await frame.locator(marketingLocators.previewEmailButton).click();
    
    // Select recipients flow
    await frame.locator(marketingLocators.selectRecipientsButton).click();
    await frame.locator(marketingLocators.manualClientsOption).click();
    await frame.locator(marketingLocators.nextButton).click();
    
    // Search for recipient
    await frame.locator(marketingLocators.tableSearch).fill(recipientName);
    
    // Wait for loading to complete
    await frame.locator(marketingLocators.loadingIndicator).waitFor({ 
      state: 'hidden', 
      timeout: 10000 
    });
    
    // Select recipient to send the campaign
    await frame.locator(marketingLocators.toggleIncludeClient).click();
    await frame.locator(marketingLocators.nextButton).click();
    await frame.locator(marketingLocators.nextButton).click();
  }

  /**
   * Send the email campaign to Mailosaur Inbox
   */
  async sendCampaign() {
    const frame = await this.getCampaignIframe();
    await frame.locator(marketingLocators.sendMyCampaignButton).click();
    await this.page.waitForTimeout(1000); // Small wait before final send
    await frame.locator(marketingLocators.sendCampaignButton).click();
  }

  /**
   * E2E flow
   * @param {string} campaignName - Campaign name
   * @param {string} subject - Email subject
   * @param {string} body - Email body
   * @param {string} recipientName - Recipient to send to
   */
  async createAndSendCampaign(campaignName, subject, body, recipientName) {
    await this.navigateToComposeEmail();
    await this.createBlankEmailCampaign(campaignName, subject, body);
    await this.selectRecipients(recipientName);
    await this.sendCampaign();
  }
}
export default MarketingPage;