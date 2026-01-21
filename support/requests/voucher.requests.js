import { testSalonData } from "../../testData/salonData.js";
import voucher from "../graphQL/queries/voucher.query.js";

/**
 * Voucher API request functions
 */
class VoucherRequests {
  /**
   * Validate GraphQL response
   * @private
   * @param {Object} response - Playwright response object
   * @returns {Promise<Object>} - Validated response data
   */
  async _validateResponse(response) {
    // Store status before consuming response body
    const status = response.status();
    const ok = response.ok();

    if (!ok) {
      const errorText = await response.text();
      throw new Error(
        `Request failed with status ${status}: ${errorText}`
      );
    }

    if (status !== 200) {
      throw new Error(`Expected status 200, got ${status}`);
    }

    const json = await response.json();

    if (json.errors) {
      throw new Error(
        `GraphQL errors: ${JSON.stringify(json.errors, null, 2)}`
      );
    }

    if (!json.data) {
      throw new Error("Response missing data field");
    }

    return {
      status,
      ok,
      data: json.data,
    };
  }

  /**
   * Create a new voucher
   * @param {Object} request - Playwright request object
   * @param {string} token - Authentication token
   * @param {Object} voucherData - Voucher data
   * @param {Object} testSalon - Salon data object
   * @param {boolean} validate - Whether to validate the response (default: true)
   * @returns {Promise<Object>} - Response object or validated data
   */
  async createVoucher(request, token, voucherData, testSalon, validate = true) {
    const securityContext = this._buildSecurityContext(testSalon);

    const response = await request.post(testSalonData.DEV.URL.GRAPHQL_URL, {
      headers: {
        authorization: `Bearer ${token}`,
        "x-memento-security-context": securityContext,
      },
      data: {
        query: voucher.createVoucher,
        variables: voucherData,
      },
    });

    if (validate) {
      const validated = await this._validateResponse(response);
      return {
        status: validated.status,
        ok: validated.ok,
        data: validated.data.createVoucher,
        voucher: validated.data.createVoucher?.voucher,
      };
    }

    return response;
  }

  /**
   * Bulk archive vouchers
   * @param {Object} request - Playwright request object
   * @param {string} token - Authentication token
   * @param {Object} testSalon - Salon data object
   * @param {boolean} validate - Whether to validate the response (default: true)
   * @returns {Promise<Object>} - Response object or validated data
   */
  async bulkArchiveVoucher(request, token, testSalon, validate = true) {
    const securityContext = this._buildSecurityContext(testSalon);
    const vars = {
      bulkRequest: {
        selectionMode: "SELECT_NONE",
        selectedIds: [],
        unselectedIds: [],
      },
      archive: true,
      filterBy: {
        positiveRemainingBalance: true,
        voucherCampaignId: null,
        thisBranch: false,
        clientName: null,
        issueDate: null,
        serial: null,
      },
    };

    const response = await request.post(testSalonData.DEV.URL.GRAPHQL_URL, {
      headers: {
        authorization: `Bearer ${token}`,
        "x-memento-security-context": securityContext,
      },
      data: {
        query: voucher.bulkArchive,
        variables: vars,
      },
    });

    if (validate) {
      const validated = await this._validateResponse(response);
      return {
        status: validated.status,
        ok: validated.ok,
        data: validated.data.bulkArchiveVouchers,
        count: validated.data.bulkArchiveVouchers?.count,
      };
    }

    return response;
  }

  /**
   * Build security context string
   * @private
   * @returns {string} - Security context string
   */
  _buildSecurityContext(testSalon) {
    return (
      testSalon.BUSINESS_ID +
      "|" +
      testSalon.BRANCH_ID +
      "|" +
      testSalon.staff[0].id
    );
  }
}

export default new VoucherRequests();
