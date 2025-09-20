import {request} from './api';

class BillingServices {
  /**
   *
   * @return {Promise<*>}
   */

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
    return request(`/billers/nb/discos`, 'GET', undefined, false, false, false);
  }
  getBillerBpProviders() {
    return request(
      `/billers/bp/check-disco`,
      'GET',
      undefined,
      false,
      false,
      false,
    );
  }

  // Add this to your billingServices
  getBillerBetting() {
    return request(
      `/billers/nb/betting`,
      'GET',
      undefined,
      false,
      false,
      false,
    );
  }

  // Add this to your billingServices
  verifyBettingWallet(data) {
    return request(
      `/billers/nb/verify-betting-wallet`,
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
      `/billers/nb/fund-wallet`,
      'POST',
      data,
      false,
      false,
      false,
    );
  }
  fundWallet(data) {
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

    return request('/billers/sp/outflow', 'POST', data, false, false, false);
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
  nbCableValidate(payload) {
    // console.log({payload});
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
  getBillerCables() {
    return request(`/billers/nb/cables`, 'GET', undefined, false, false, false);
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
  cablePay(payload) {
    // console.log({payload});
    return request(
      '/billers/nb/cable/create-order',
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
