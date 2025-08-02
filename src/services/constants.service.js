import {request} from './api';

class ConstantServices {
  /**
   *
   * @return {Promise<*>}
   */
  getConstants() {
    return request('/constants', 'GET', undefined, false, false, false);
  }

  
}

export default new ConstantServices();
