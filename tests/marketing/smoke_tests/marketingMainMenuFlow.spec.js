import { test, expect } from "@playwright/test";
import generalCommands from "../../../support/generalCommands.js";
import { testSalonData } from "../../../testData/salonData.js";

test("Validate that user can open Phorest Ads Manager @marketing @smoke", async ({
  page,
  request,
 }) => {
  //Test Data
  const staffEmailDev =
    testSalonData.DEV.EU.SINGLE_BRANCH.IRELAND_SALON.staff[0].email;
  const staffPasswordDev = process.env.DEV_staffPassword;
  
  //Login Details
  await generalCommands.loginByPassDev(
    page,
    request,
    staffEmailDev,
    staffPasswordDev,
  );

 //Navigate to Marketing in the side menu 
    await page.locator('[id="main-nav-marketing-link"]').click();
 //Navigate to Ads Manager in Marketing Main menu 
   await page.locator('[name="manage-my-ads"]').click();
 //Assert that Facebook & Instagram Ads is displayed in Ads Manager 
   await expect(page.getByText('Facebook & Instagram Ads')).toBeVisible();
});
