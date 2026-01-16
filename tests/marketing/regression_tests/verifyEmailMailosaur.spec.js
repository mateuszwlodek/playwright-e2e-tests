// tests/marketing/regression_tests/verifyEmailMailosaur.spec.js
import { test, expect } from '@playwright/test';
import generalCommands from "../../../support/generalCommands.js";
import { faker } from '@faker-js/faker';
import { returnEmailIDFromMailosaur } from '../../../helpers/emailHelpers.js/mailosaur.helper.js';
import MarketingPage from '../../../pages/marketing.page.js';

test.describe('Marketing', () => {

  test('Validate that user can create & send an email campaign to Mailosaur', async ({ page, request }) => {
    test.setTimeout(240000);
    //Test Data
    const staffEmail = process.env.staffEmail;
    const staffPassword = process.env.staffPassword;
    const unique = Date.now().toString();
    const subject = `${faker.lorem.word()}${faker.person.firstName()}`;
    const campaignName = `MailosaurEmail${unique}`;
    const emailBody = 'Hi Mailosaur, this is an automated email ';

    //Login Details
    await generalCommands.loginByPass(page, request, staffEmail, staffPassword);

    //Create a Marketing Page Object
    const marketingPage = new MarketingPage(page);
    
    //Create and Send Campaign
    await marketingPage.createAndSendCampaign(
      campaignName,
      subject,
      emailBody,
      'Mailosaur EmailInbox'
    );

    // Verify the email in Mailosaur
    console.log('⏳ Waiting for email in Mailosaur...');
    const email = await returnEmailIDFromMailosaur(subject);

    expect(email.subject).toContain(subject);
    expect(email.text.body).toContain(emailBody);
    expect(email.text.body).toContain(
      'Powered by Phorest. To unsubscribe from the mailing list, click here'
    );
    
    console.log('✅ Test passed! Email received in Mailosaur');
  });
});