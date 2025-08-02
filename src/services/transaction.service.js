import {request} from './api';

class TransactionServices {
  /**
   *
   * @return {Promise<*>}
   */
  getTransactions(description) {
    return request(`/transactions?description=${description}`, 'GET', undefined, false, false, false);
  }
  getTransaction(id) {
    return request(
      `/transactions/${id}`,
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
  getTransById(id) {
    return request(
      `/transactions/${id}`,
      'GET',
      undefined,
      false,
      false,
      false,
    );
  }
  // getTxToken(id) {
  //   return request(
  //     `/billers/nb/${id}/token`,
  //     'GET',
  //     undefined,
  //     false,
  //     false,
  //     false,
  //   );
  // }
  getTxToken(id) {
    return request(
      `/billers/bp/re-query/${id}`,//:id
      'GET',
      undefined,
      false,
      false,
      false,
    );
  }
}

export default new TransactionServices();
