export const testSalonData = {
  DEV: {
    URL: {
      BASE_URL: "https://my-dev.phorest.com",
      API_URL: "http://dev.phorest.com",
      API_GATEWAY_URL: "https://api-gateway-dev.phorest.com",
      GRAPHQL_URL: "https://api-gateway-dev.phorest.com/api-facade/graphql",
      TOKEN_URL: "https://api-gateway-dev.phorest.com/auth/oauth/token",
    },
    EU: {
      SINGLE_BRANCH: {
        IRELAND_SALON: {
          ACCOUNT_ID: 38853,
          BUSINESS_ID: "sxoK7HHxUul4HHlK0g53tA",
          BRANCH_ID: "wPZyP5mEARKoAIT5GEBreA",
          staff: [
            {
              name: "June Bug",
              email: "june@ie.com",
              id: "gccIaRlziUExWD-FWye_FQ",
            },
          ],
        },
        IE_TIPPING_SALON: {
          STRIPE_KEY: process.env.IE_STRIPE_KEY,
          ACCOUNT_ID: 47404,
          BUSINESS_ID: "xhTWSKHAxsq2j5_txK9gOg",
          BRANCH_ID: "c3Bh2MepzG8J88YE6bV1aQ",
          TERMINAL_ID: "tmr_GKt9KQlzOyzlfD",

          // Salon Stripe Account Details
          SALON_NAME: "PAY Automation IE Salon - Branch 1",
          SALON_MERCHANT_ACCOUNT_ID: "ma-MgpDD079KC7dYrpe",
          SALON_CONNECTED_ACCOUNT_ID: "acct_1PyFcfQTmR91Kbej",

          // Tipping Staff Stripe Account Details
          TIPPING_STAFF_NAME: "Rachel Testings",
          TIPPING_STAFF_MERCHANT_ACCOUNT_ID: "ma-vMPD7dr16Ikxejrj",
          TIPPING_STAFF_CONNECTED_ACCOUNT_ID: "acct_1S0eC032VIP7a7q6",

          // MM Staff Stripe Account Details
          MULTI_MERCHANT_STAFF_NAME: "Michaela Quality",
          MULTI_MERCHANT_STAFF_MERCHANT_ACCOUNT_ID: "ma-K501EopMEUWE33op",
          MULTI_MERCHANT_STAFF_CONNECTED_ACCOUNT_ID: "acct_1S0eKi3UU9ObdX4H",

          // Payment Processing Fees
          SALON_VAT_RATE: 23,
          CARD_PRESENT_FLAT_FEE: 0.22, // Applies to "regular" card brand present transactions
          CARD_PRESENT_PERCENTAGE_FEE: 1.15, // Applies to "regular" card brand present transactions
          AMEX_FLAT_FEE: 0.75, // Applies to AMEX card present transactions
          AMEX_PERCENTAGE_FEE: 2.2, // Applies to AMEX card present transactions
          STORED_CARD_FLAT_FEE: 0.45, // Applies to stored card + VT
          STORED_CARD_PERCENTAGE_FEE: 1.0, // Applies to stored card + VT
          DIRECT_TIPPING_PERCENTAGE_FEE: 10.0, // Applies to direct tipping transactions where tip is paid directly to staff account
          ONLINE_BOOKING_FLAT_FEE: 0.5, // Applies to in-house (stored card + VT) & online
          ONLINE_BOOKING_PERCENTAGE_FEE: 1.1, // Applies to in-house (stored card + VT) & online
          ONLINE_BOOKING_FEE_TIER: 0.8, // Applies to in-house (stored card + VT) & online - this is the minFee amount
          MEMBERSHIP_BILLING_FLAT_FEE: 0.45, // Applies to Membership subscription fee
          MEMBERSHIP_BILLING_PERCENTAGE_FEE: 3.5, // Applies to Membership subscription fee
          NO_SHOW_PERCENTAGE_FEE: 0, // Applies to No-Show/Cancellation protection charges
          NO_SHOW_FLAT_FEE: 0, // Applies to No-Show/Cancellation protection charges
          ONLINE_RETAIL_FLAT_FEE: 0.25, // Applies to OGV/EComm transactions
          ONLINE_RETAIL_PERCENTAGE_FEE: 2.9, // Applies to OGV/EComm transactions
          KLARNA_FLAT_FEE: 0.3, /// Applies to transactions using Klarna as a payment method
          KLARNA_PERCENTAGE_FEE: 6.0, // Applies to transactions using Klarna as a payment method

          // Online Booking Threshold Value - the amount over which online booking flat fee and percentage fee values will be charged, otherwise the fee tier amount will be charged
          ONLINE_BOOKING_FLAT_PERCENTAGE_THRESHOLD: 50.01,

          // Minimum paymentIntent amount required to successfully process a payment - EUR
          MINIMUM_TRANSACTION_VALUE: 0.5,

          staff: [
            {
              // Tipping Staff
              name: "Rachel Testings",
              email: "r.testings@gmail.com",
              id: "c3Bh2MepzG8J88YE6bV1aQ",
            },
          ],
        },
        UK_NONTIPPING_SALON: {
          STRIPE_KEY: process.env.UK_STRIPE_KEY,
          ACCOUNT_ID: 47403,
          BUSINESS_ID: "x5Hz3_8G-PeOF3GeGcT-oQ",
          BRANCH_ID: "h6x5cwGfZwHmyoHPpS9Qkw",
          TERMINAL_ID: "tmr_F1ZwQgcHzZY0X5",

          // Salon Stripe Account Details
          SALON_NAME: "PAY Automation GB Salon - Branch 1",
          SALON_MERCHANT_ACCOUNT_ID: "ma-ZJAOKP2Gpf2lM1xw",
          SALON_CONNECTED_ACCOUNT_ID: "acct_1PxsBQQHb23tshN1",

          // Tipping Staff Stripe Account Details
          TIPPING_STAFF_NAME: "Rebecca Testerson",
          TIPPING_STAFF_MERCHANT_ACCOUNT_ID: "ma-lwYL5voXeFR3Xvp1",
          TIPPING_STAFF_CONNECTED_ACCOUNT_ID: "acct_1R6phLQE77faBUAE",

          // MM Staff Stripe Account Details
          MULTI_MERCHANT_STAFF_NAME: "Megan Sampler",
          MULTI_MERCHANT_STAFF_MERCHANT_ACCOUNT_ID: "ma-onmJpvZKdty7oDR8",
          MULTI_MERCHANT_STAFF_CONNECTED_ACCOUNT_ID: "acct_1Ree9S4f5yYd627A",

          // Payment Processing Fees
          SALON_VAT_RATE: 23,
          CARD_PRESENT_FLAT_FEE: 0.4, // Applies to "regular" card brand present transactions
          CARD_PRESENT_PERCENTAGE_FEE: 1.75, // Applies to "regular" card brand present transactions
          AMEX_FLAT_FEE: 1, // Applies to AMEX card present transactions
          AMEX_PERCENTAGE_FEE: 3.4448, // Applies to AMEX card present transactions
          STORED_CARD_FLAT_FEE: 0.75, // Applies to stored card + VT
          STORED_CARD_PERCENTAGE_FEE: 1.26, // Applies to stored card + VT
          DIRECT_TIPPING_PERCENTAGE_FEE: 10.0, // Applied to direct tipping transactions where tip is paid directly to staff account
          ONLINE_BOOKING_FLAT_FEE: 0.22, // Applies to in-house (stored card + VT) & online
          ONLINE_BOOKING_PERCENTAGE_FEE: 2, // Applies to in-house (stored card + VT) & online
          ONLINE_BOOKING_FEE_TIER: 0.86, // Applies to in-house (stored card + VT) & online - this is the minFee amount
          MEMBERSHIP_BILLING_FLAT_FEE: 0.65, // Applies to Membership subscription fee
          MEMBERSHIP_BILLING_PERCENTAGE_FEE: 4.55, // Applies to Membership subscription fee
          NO_SHOW_PERCENTAGE_FEE: 0.25, // Applies to No-Show/Cancellation protection charges
          NO_SHOW_FLAT_FEE: 0, // Applies to No-Show/Cancellation protection charges
          ONLINE_RETAIL_FLAT_FEE: 0.5, // Applies to OGV/EComm transactions
          ONLINE_RETAIL_PERCENTAGE_FEE: 2.5091, // Applies to OGV/EComm transactions
          KLARNA_FLAT_FEE: 0.3, /// Applies to transactions using Klarna as a payment method
          KLARNA_PERCENTAGE_FEE: 6.0, // Applies to transactions using Klarna as a payment method

          // Online Booking Threshold Value - the amount over which online booking flat fee and percentage fee values will be charged, otherwise the fee tier amount will be charged
          ONLINE_BOOKING_FLAT_PERCENTAGE_THRESHOLD: 63.5,

          // Minimum paymentIntent amount required to successfully process a payment - GBP
          MINIMUM_TRANSACTION_VALUE: 0.3,

          staff: [
            {
              name: "Jamie Regressionson",
              email: "jamie.regressionson@test.com",
              id: "O_3NytW6aUzwU4LVs9MWSw",
            },
          ],
        },
      },
      MULTI_BRANCH: {},
    },
    US: {
      SINGLE_BRANCH: {},
      MULTI_BRANCH: {},
    },
  },
  PROD: {
    URL: {
      BASE_URL: "https://my.phorest.com",
      API_URL: "https://prod-us.phorest.com",
      API_GATEWAY_URL: "https://api-gateway-us.phorest.com",
      GRAPHQL_URL: "https://api-gateway-us.phorest.com/api-facade/graphql",
      TOKEN_URL: "https://api-gateway-us.phorest.com/auth/oauth/token",
    },
    EU: {
      SINGLE_BRANCH: {},
      MULTI_BRANCH: {},
    },
    US: {
      SINGLE_BRANCH: {},
      MULTI_BRANCH: {
        QA_AUTOMATION_SALON: {
          ACCOUNT_ID: 44229,
          BUSINESS_ID: "TAEsIYSBlma1pp4XxSNLYg",
          BRANCH_ID: "ECQEjnaQgqGZSI23gfvgUw",
          staff: [
            {
              name: "Danny Archer",
              email: "danny@us.com",
              id: "rZcT-fQ8AxtDf6t5QI06Qw",
            },
            {
              name: "Donald Tramp",
              email: "donald@us.com",
              id: "ECQEjnaQgqGZSI23gfvgUw",
            },
            {
              name: "Peter Griffin",
              email: "peter@us.com",
              id: "ohBxdu5JxUffFZHdmHeWwA",
            },
          ],
        },
      },
    },
  },
};
