import MailosaurClient from 'mailosaur';

const mailosaur = new MailosaurClient(process.env.MAILOSAURAPIKEY);
const SERVER_ID = process.env.MAILOSAUR_SERVER_ID;

//Wait for email by subject
export async function returnEmailIDFromMailosaur(subject, options = {}) {
  const {
    maxRetries = 8,           // equivalent to wait_time_mins
    waitTimeMs = 60_000,      // 60 seconds
  } = options;

  let counter = 0;

  while (counter <= maxRetries) {
    const result = await mailosaur.messages.search(
      SERVER_ID,
      { subject }
    );

    if (!result.items || result.items.length === 0) {
      if (counter === maxRetries) {
        throw new Error(
          `Email was not found in Mailosaur inbox after checking for ${maxRetries} minutes`
        );
      }

      console.log('Checking Mailosaur inbox for email...');
      await new Promise(res => setTimeout(res, waitTimeMs));
      counter++;
      continue;
    }

    console.log('Email arrived in Mailosaur inbox');

    const messageId = result.items[0].id;
    const email = await mailosaur.messages.getById(messageId);

    if (email.subject !== subject) {
      throw new Error('Email subject does not match expected subject');
    }

    return email;
  }
}

/**
 * Wait for SMS by unique body text
 */
export async function returnSmsIDFromMailosaur(uniqueName, options = {}) {
  const {
    maxRetries = 8,
    waitTimeMs = 60_000,
  } = options;

  let counter = 0;

  console.log('Checking SMS arrived in Mailosaur by body content');

  while (counter <= maxRetries) {
    const result = await mailosaur.messages.search(
      SERVER_ID,
      { body: uniqueName }
    );

    if (!result.items || result.items.length === 0) {
      if (counter === maxRetries) {
        throw new Error(
          `SMS was not found in Mailosaur inbox after checking for ${(maxRetries * waitTimeMs) / 60000} minutes`
        );
      }

      console.log('Checking SMS inbox...');
      await new Promise(res => setTimeout(res, waitTimeMs));
      counter++;
      continue;
    }

    console.log('SMS found in Mailosaur inbox');

    const messageId = result.items[0].id;
    const sms = await mailosaur.messages.getById(messageId);

    return sms;
  }
}

