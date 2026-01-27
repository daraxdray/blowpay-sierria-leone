import {request} from './api';

class VirtualService {
  /**
   *
   * @return {Promise<*>}
   */
  getVirtualAccount() {
    return request('/virtual-account', 'GET', undefined, false, false, false);
  }

  /**
   *
   * @return {Promise<*>}
   */
  getVirtualBalance() {
    return request(
      '/virtual-account/balance',
      'GET',
      undefined,
      false,
      false,
      false,
    );
  }
  /**
   * @param {string} id
   * @return {Promise<*>}
   */
  getRecieverAcc(queryParam) {
    return request(
      `/virtual-account/all?${queryParam}`,
      'GET',
      undefined,
      false,
      false,
      false,
    );
  }
  /**
   *
   * @param {{accountNumber: string}{amount: number} } payload
   * @return {Promise<*>}
   */
  transfer(payload) {
    console.log({payload});
    return request(
      '/virtual-account/transfer',
      'POST',
      payload,
      undefined,
      undefined,
      undefined,
    );
  }
}

export default new VirtualService();
