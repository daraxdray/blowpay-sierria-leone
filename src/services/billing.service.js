import {request} from './api';

class BillingServices {
  /**
   *
   * @return {Promise<*>}
   */

  getBpDataPlans(provider) {
    return request(
      `/billers/bp/price-list?vertical=DATA&provider=${provider}`,
      'GET',
      undefined,
      false,
      false,
      false,
    );
  }
  BpAirtime(payload) {
    // console.log({payload});
    return request(
      '/billers/bp/vend-airtime/',
      'POST',
      payload,
      undefined,
      undefined,
      undefined,
    );
  }
  BpPerfomanceMetrics() {
    return request(
      '/billers/bp/provider-status/',
      'GET',
      undefined,
      false,
      false,
      false,
    );
  }

  getBillerProductsByCategory(id) {
    return request(
      `/billers/category/${id}`,
      'GET',
      undefined,
      false,
      false,
      false,
    );
  }
  getBillerNbProviders() {
    return request('/billers/nb/discos', 'GET', undefined, false, false, false);
  }
  getBillerBpProviders() {
    return request(
      '/billers/bp/check-disco',
      'GET',
      undefined,
      false,
      false,
      false,
    );
  }
  BpCheckMeter(payload) {
    // console.log(payload, 'payload');
    return request(
      '/billers/bp/check-meter',
      'POST',
      payload,
      false,
      false,
      false,
    );
  }

  getBillerBetting() {
    return request(
      '/billers/nb/betting',
      'GET',
      undefined,
      false,
      false,
      false,
    );
  }
  verifyBettingWallet(data) {
    return request(
      '/billers/nb/verify-betting-wallet',
      'POST',
      data,
      false,
      false,
      false,
    );
  }

  // Add this to your billingServices
  fundBettingWallet(data) {
    return request(
      '/billers/nb/fund-wallet',
      'POST',
      data,
      false,
      false,
      false,
    );
  }
  fundWallet(data) {
    // console.log(data, 'payload');

    return request(
      '/virtual-account/sle/fund',
      'POST',
      data,
      false,
      false,
      false,
    );
  }
  spBillPayment(data) {
    // console.log(data);

    return request('/billers/sp/outflow', 'POST', data, false, false, false);
  }

  validateBilling(data) {
    // console.log(data);

    return request('/billers/sp/validate', 'POST', data, false, false, false);
  }
  billValidate(payload) {
    // console.log({payload});
    return request(
      '/billers/validate/',
      'POST',
      payload,
      undefined,
      undefined,
      undefined,
    );
  }

  nbBillValidate(payload) {
    // console.log({payload});
    return request(
      '/billers/nb/validate/',
      'POST',
      payload,
      undefined,
      undefined,
      undefined,
    );
  }

  bpBillValidate(payload) {
    // console.log({payload});
    return request(
      '/billers/bp/check-meter/',
      'POST',
      payload,
      undefined,
      undefined,
      undefined,
    );
  }
  async bpCableValidate(payload) {
    console.log('Payload:', payload);
    try {
      const response = await request(
        '/billers/nb/cable/validate',
        'POST',
        payload,
        undefined,
        undefined,
        undefined,
      );
      console.log('Response:', response); // <-- log response here
      return response;
    } catch (error) {
      console.error('Error in bpCableValidate:', error);
      throw error; // rethrow if needed
    }
  }
  nbCableValidate(payload) {
    console.log({payload});
    return request(
      '/billers/nb/cable/validate/',
      'POST',
      payload,
      undefined,
      undefined,
      undefined,
    );
  }
  /**
   * @param {string} id
   * @return {Promise<*>}
   */
  getBillerProducts(id) {
    return request(
      `/billers/${id}/products`,
      'GET',
      undefined,
      false,
      false,
      false,
    );
  }

  getBillerCables(provider) {
    return request(
      `/billers/bp/price-list?vertical=TV&provider=${provider}`,
      'GET',
      undefined,
      false,
      false,
      false,
    );
  }

  getSLCablesPlan() {
    return request(
      '/billers/sp/package-list',
      'GET',
      undefined,
      false,
      false,
      false,
    );
  }

  /**
   *
   * @param {{productId: string}{amountEntered: string} } payload
   * @return {Promise<*>}
   */
  billPay(payload) {
    // console.log({payload});
    return request(
      '/billers/orders/create',
      'POST',
      payload,
      undefined,
      undefined,
      undefined,
    );
  }
  dataPay(payload) {
    console.log(payload, 'payload');
    return request(
      '/billers/bp/vend-data',
      'POST',
      payload,
      undefined,
      undefined,
      undefined,
    );
  }

  cablePay(payload) {
    // console.log({payload});
    return request(
      '/billers/bp/vend-tv',
      'POST',
      payload,
      undefined,
      undefined,
      undefined,
    );
  }
  nbbillPay(payload) {
    // console.log({payload});
    return request(
      '/billers/nb/create-order',
      'POST',
      payload,
      undefined,
      undefined,
      undefined,
    );
  }
  //buypower
  bpbillPay(payload) {
    // console.log({payload});
    return request(
      '/billers/bp/vend-electricity',
      'POST',
      payload,
      undefined,
      undefined,
      undefined,
    );
  }
  /**
   *
   * @param {{productId: string}{amountEntered: string} } payload
   * @return {Promise<*>}
   */
}

export default new BillingServices();
