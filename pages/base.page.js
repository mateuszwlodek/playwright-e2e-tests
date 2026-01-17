// pages/base.page.js

class BasePage {
    constructor(page) {
      this.page = page;
    }
  
    /**
     * Navigate to the URL
     * @param {string} url - URL to navigate to
     */
    async goto(url) {
      await this.page.goto(url);
    }
  
    /**
     * Wait for an element to be visible on the page
     * @param {string} selector - Selects an element
     * @param {number} timeout - Timeout in MS
     */
    async waitForElement(selector, timeout = 30000) {
      await this.page.waitForSelector(selector, { state: 'visible', timeout });
    }
  
    /**
     * Get the iframe by selector and wait for it to load page
     * @param {string} selector - Iframe selector
     * @param {string} contentSelector - To select inside the frame
     * @param {number} timeout - Timeout in MS
     * @returns {FrameLocator}
     */

    async getIframe(selector, contentSelector = null, timeout = 30000) {
      // Wait for the iframe to be attached to the page 
      await this.page.waitForSelector(selector, { 
        state: 'attached', 
        timeout 
      });
  
      // Small wait for iframe content to start loading
      await this.page.waitForTimeout(1500);
  
      const frame = this.page.frameLocator(selector);
  
      // If contentSelector provided, wait for it
      if (contentSelector) {
        await frame.locator(contentSelector).waitFor({ 
          state: 'visible', 
          timeout 
        });
      }
  
      return frame;
    }
  
    /**
     * Click an element
     * @param {string} selector - Element selector
     */
    async click(selector) {
      await this.page.locator(selector).click();
    }
  
    /**
     * Fill an input field
     * @param {string} selector - Input selector
     * @param {string} value - Value to fill
     */
    async fill(selector, value) {
      await this.page.locator(selector).fill(value);
    }
  
    /**
     * Fill a contenteditable element for rich text editor
     * @param {string} selector - Element selector
     * @param {string} value - Value to type for the inputs
     * @param {number} delay - Delay in ms for typing
     */
    async fillContentEditable(selector, value, delay = 50) {
      const element = this.page.locator(selector);
      await element.waitFor({ state: 'visible' });
      await element.click();
      
      // Clear existing content
      await this.page.keyboard.press('ControlOrMeta+A');    // Keyboard shortcut to clear content on the input fields, if any
      await this.page.keyboard.press('Backspace');
      
      // Type new content
      await element.pressSequentially(value, { delay });
    }
  
    /**
     * Fill a contenteditable element in iframe
     * @param {FrameLocator} frame - Frame locator
     * @param {string} selector - Element selector
     * @param {string} value - Value to type
     * @param {number} delay - Delays in ms
     */
    async fillContentEditableInFrame(frame, selector, value, delay = 50) {
      const element = frame.locator(selector);
      await element.waitFor({ state: 'visible' });
      await element.click();
      await this.page.keyboard.press('ControlOrMeta+A');
      await this.page.keyboard.press('Backspace');
      await element.pressSequentially(value, { delay });
    }
  
    /**
     * Get text content of an element
     * @param {string} selector - Element selector
     * @returns {Promise<string>}
     */
    async getText(selector) {
      return await this.page.locator(selector).textContent();
    }
  
    /**
     * Wait for URL to match pattern
     * @param {RegExp|string} pattern - URL pattern to match
     * @param {number} timeout - Timeout in milliseconds
     */
    async waitForURL(pattern, timeout = 30000) {
      await this.page.waitForURL(pattern, { timeout });
    }
  
    /**
     * Click element with retry logic for unstable elements
     * @param {string} selector - Element selector
     * @param {number} maxRetries - Maximum number of retries
     */
    async clickWithRetry(selector, maxRetries = 3) {
      for (let i = 0; i < maxRetries; i++) {
        try {
          await this.page.locator(selector).click({ timeout: 10000 });
          return; // Success
        } catch (error) {
          if (i === maxRetries - 1) throw error;
          console.log(`Click failed, retrying... (${i + 1}/${maxRetries})`);
          await this.page.waitForTimeout(1000);
        }
      }
    }
  
    /**
     * Click element in iframe with retry logic
     * @param {FrameLocator} frame - Frame locator
     * @param {string} selector - Element selector
     * @param {number} maxRetries - Maximum number of retries
     */
    async clickInFrameWithRetry(frame, selector, maxRetries = 3) {
      for (let i = 0; i < maxRetries; i++) {
        try {
          await frame.locator(selector).waitFor({ state: 'visible', timeout: 5000 });
          await frame.locator(selector).click({ timeout: 10000 });
          return; // Success
        } catch (error) {
          if (i === maxRetries - 1) throw error;
          console.log(`Click failed, retrying... (${i + 1}/${maxRetries})`);
          await this.page.waitForTimeout(1000);
        }
      }
    }
  }
  export default BasePage;