// Marketing page locators
export const marketingLocators = {
  // Main page locators
  composeEmailLink: '[name="compose-email-link"]',
  
  // Iframe selector
  iframeSelector: 'iframe[name="iframe-embed"]',
  
  // Modal locators (in iframe)
  modalCampaignNameInput: '[name="campaign-name"]',
  modalSaveButton: 'button:has-text("save")',
  modalCancelButton: 'button:has-text("Cancel")',
  
  // Campaign editor locators (in iframe)
  campaignsBreadcrumb: '#campaigns-breadcrumb',
  createBlankButton: '#create-blank-campaign',
  renameCampaignButton: '[name="rename-campaign"]',
  campaignNameInput: '[name="campaign-name"]',
  saveButton: '[name="save"]',
  subjectInput: '[name="subject"]',
  textBlock: '[data-pendo-name="text-block"]',
  previewEmailButton: '[name="preview-email"]',
  
  // Recipient selection locators (in iframe)
  selectRecipientsButton: '#select-recipients',
  manualClientsOption: '[name="audience-manual-clients"]',
  nextButton: '[name="next"]',
  tableSearch: '[name="table-search"]',
  loadingIndicator: '._loading-indicator_tuvuvs',
  toggleIncludeClient: '#toggle-include-client',
  
  // Send campaign locators (in iframe)
  sendMyCampaignButton: '[name="send-my-campaign"]',
  sendCampaignButton: '[name="send-campaign"]',
  
  // Ads Manager locators
  manageMyAdsLink: '[name="manage-my-ads"]',
  facebookInstagramAdsText: 'text="Facebook & Instagram Ads"',
};
