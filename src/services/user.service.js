import { request } from './api';

class UserServices {
  /**
   *
   * @return {Promise<*>}
   */
  getUser() {
    return request('/user/me', 'GET', undefined, false, false, false);
  }

  /**
   *
   * @param { } payload
   * @return {Promise<*>}
   */
  editUser(payload) {
    console.log({ payload });
    return request('/user', 'PATCH', payload, undefined, undefined, undefined);
  }


  /**
   *
   * @para {{emailAddress: string}} payload
   * @return {Promise<*>}
   */
  sendOtpForPin() {

    return request(
      '/passcode/forgot',
      'POST',
        undefined,
      undefined,
      undefined,
      undefined,
    );
  }

  /**
   *
   * @param {{passcode: string}} payload
   * @return {Promise<*>}
   */
  resetPasscode(payload) {
    console.log({ payload });
    return request(
      '/passcode/reset',
      'POST',
      payload,
      undefined,
      undefined,
      undefined,
    );
  }
  


}



export default new UserServices();
