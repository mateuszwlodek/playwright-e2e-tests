// Lead form page locators
export const leadFormLocators = {
  // Form input fields
  firstNameInput: '[data-testid="firstNameInput"]',
  lastNameInput: '[data-testid="lastNameInput"]',
  phoneInput: '[data-testid="phoneInput"]',
  emailInput: '[data-testid="emailInput"]',
  noteInput: '[data-testid="noteInput"]',
  
  // Form actions
  submitButton: '[data-testid="submitButton"]',
  
  // Contact method selection (email option - second image)
  emailOptionImage: 'img',
  emailOptionImageIndex: 1, // nth(1)
  
  // Success page elements
  goToHomePageButton: '[data-testid="goToHomePageButton"]',
  
  // Page verification
  pageTitle: 'text="Request a Call Back"',
};
