// pages/marketing.page.js

import BasePage from './base.page.js';

class MarketingPage extends BasePage {
  constructor(page) {
    super(page);
    
    // These are the locators for the main page 
    this.marketingNavLink = '#main-nav-marketing-link';
    this.composeEmailLink = '[name="compose-email-link"]';
    
    // Iframe selector
    this.iframeSelector = 'iframe[name="iframe-embed"]';
    
    // Modal locators on the iframe
    this.modalCampaignNameInput = '[name="campaign-name"]';
    this.modalSaveButton = 'button:has-text("save")';
    this.modalCancelButton = 'button:has-text("Cancel")';
    
    // Iframe locators for E2E steps
    this.campaignsBreadcrumb = '#campaigns-breadcrumb';
    this.createBlankButton = '#create-blank-campaign';
    this.renameCampaignButton = '[name="rename-campaign"]';
    this.campaignNameInput = '[name="campaign-name"]';
    this.saveButton = '[name="save"]';
    this.subjectInput = '[name="subject"]';
    this.textBlock = '[data-pendo-name="text-block"]';
    this.previewEmailButton = '[name="preview-email"]';
    this.selectRecipientsButton = '#select-recipients';
    this.manualClientsOption = '[name="audience-manual-clients"]';
    this.nextButton = '[name="next"]';
    this.tableSearch = '[name="table-search"]';
    this.loadingIndicator = '._loading-indicator_tuvuvs';
    this.toggleIncludeClient = '#toggle-include-client';
    this.sendMyCampaignButton = '[name="send-my-campaign"]';
    this.sendCampaignButton = '[name="send-campaign"]';
    }

  /**
   * Get the marketing campaigns iframe
   * @param {number} timeout - Timeout in milliseconds
   * @returns {FrameLocator}
   */
     async getCampaignIframe(timeout = 30000) {
    //Wait for iframe to be attached
      await this.page.waitForSelector(this.iframeSelector, { 
      state: 'attached', 
      timeout 
    });
    
    //Small delay for iframe content to load
    await this.page.waitForTimeout(2000); 
    const frame = this.page.frameLocator(this.iframeSelector);
    
    // Wait for campaigns breadcrumb to ensure content is ready
    await frame.locator(this.campaignsBreadcrumb).waitFor({ 
      state: 'visible', 
      timeout 
    });
    
    return frame;
}
    //Navigate to compose email page
    async navigateToComposeEmail() {
      await this.click(this.marketingNavLink);
      await this.click(this.composeEmailLink);
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
    
  //Verify we're on campaigns page
  await frame.locator(this.campaignsBreadcrumb).waitFor({ state: 'visible' });
    
  //Create blank campaign
  await frame.locator(this.createBlankButton).click();
    
  //Wait for campaign editor to load
  await this.page.waitForTimeout(3000);
    
  //Look for rename button in iframe
  const renameButtonExists = await frame.locator(this.renameCampaignButton)
    .isVisible()
    .catch(() => false);
    
  if(renameButtonExists) {
    await frame.locator(this.renameCampaignButton).click();
      
  //Wait for modal to appear on main page
  await this.page.waitForTimeout(3000);
      
  //The input is on the MAIN PAGE with name="campaign-name" and placeholder="New Campaign"
    const modalInput = this.page.locator('input[name="campaign-name"]');
    await this.page.keyboard.type(campaignName);
  //Save the modal after renaming the campaign
    const saveButton = frame.locator('button[name="save"]');
    await saveButton.waitFor({ state: 'visible', timeout: 10000 });
    await saveButton.click();
  // Wait for modal to close
      await this.page.waitForTimeout(2000);
}
    
  // Set subject of the email campaign
    await this.fillContentEditableInFrame(frame, this.subjectInput, subject);

  // Set body of the email campaign
    await this.fillContentEditableInFrame(frame, this.textBlock, body);
  }

//Preview the email campaign
  async previewCampaign() {
    const frame = await this.getCampaignIframe();
    await frame.locator(this.previewEmailButton).click();
    
  }

  /**
   * Select recipients for campaign
   * @param {string} recipientName - 
   */
  async selectRecipients(recipientName) {
    const frame = await this.getCampaignIframe();
    
    //Preview first if not already done
    await frame.locator(this.previewEmailButton).click();
    
   //Select recipients flow
    await frame.locator(this.selectRecipientsButton).click();
    await frame.locator(this.manualClientsOption).click();
    await frame.locator(this.nextButton).click();
    
   //Search for recipient
    await frame.locator(this.tableSearch).fill(recipientName);
    
   // Wait for loading to complete
    await frame.locator(this.loadingIndicator).waitFor({ 
      state: 'hidden', 
      timeout: 10000 
    });
    
  //Select recipient to send the campaign
    await frame.locator(this.toggleIncludeClient).click();
    await frame.locator(this.nextButton).click();
    await frame.locator(this.nextButton).click();
  }

 //Send the email campaign to Mailosaur Inbox
  async sendCampaign() {
    const frame = await this.getCampaignIframe();
    await frame.locator(this.sendMyCampaignButton).click();
    await this.page.waitForTimeout(1000); // Small wait before final send
    await frame.locator(this.sendCampaignButton).click();
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