import {request} from './api';
// import {API_URL} from '@env';
import {Code, CodeSymbol, CurrencyList, _getTokenLocal} from '../utils';
class AuthServices {
  /**
   *
   * @param {{emailAddress: string, password: string, firstName: string, lastName: string, username: string}} payload
   * @return {Promise<*>}
   */
  register(payload) {
    return request('/auth/register', 'POST', payload, false, false, false);
  }



  getServerStatus() {
    return request('/system-info', 'GET',undefined, false, false, false);
  }

  /**
   *
   * @param {{emailAddress: string, password: string}} payload
   * @return {Promise<*>}
   */

  login(payload) {
    return request('/auth/login', 'POST', payload, false, false, false);
  }
  /**
   *
   * @param {{emailAddress: string, otp: string}} payload
   * @return {Promise<*>}
   */
  verifyOtp(payload) {
    console.log({payload});
    return request(
      '/auth/otp/verify',
      'POST',
      payload,
      undefined,
      undefined,
      undefined,
    );
  }

  /**
   *
   * @para {{emailAddress: string}} payload
   * @return {Promise<*>}
   */
  resendOtp(payload) {
    
    return request(
      '/auth/otp/resend',
      'POST',
      payload,
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
  setPasscode(payload) {
    console.log({payload});
    return request(
      '/passcode',
      'POST',
      payload,
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
  confirmPasscode(payload) {
    return request(
      '/passcode/verify',
      'POST',
      payload,
      undefined,
      undefined,
      undefined,
    );
  }
  loginPasscode(payload) {
    return request(
      '/passcode/login',
      'POST',
      payload,
      undefined,
      undefined,
      undefined,
    );
  }

  /**
   *
   * @param {{emailAddress: string}} payload
   * @return {Promise<*>}
   */
  forgotPassword(payload) {
    return request(
      '/auth/forgot-password',
      'POST',
      payload,
      false,
      false,
      false,
    );
  }

  /**
   *
   * @param {{token: string, id: string, password: string}} payload
   * @return {Promise<*>}
   */
  resetPassword(payload) {
    return request(
      '/auth/reset-password',
      'POST',
      payload,
      false,
      false,
      false,
    );
  }

  /**
   *
   * @return {Promise<*>}
   */
  logout() {
    return request('/auth/logout', 'POST', undefined, false, false, false);
  }

  /**
   *
   * @param {{oldPassword: string, newPassword: string}} payload
   * @return {Promise<*>}
   */
  changePassword(payload) {
    return request(
      '/auth/change-password',
      'POST',
      payload,
      false,
      false,
      false,
    );
  }

  KYC(payload) {
    console.log({payload});
    return request('/kyc/complete', 'POST', payload, true);
  }
  updateUser(payload) {
    console.log({payload});
    return request('/user', 'Patch', payload, false, false, false);
  }
}

export default new AuthServices();
