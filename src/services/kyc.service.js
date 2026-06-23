import {request} from './api';

class KycService {
  verifyNin(nin) {
    return request('/kyc/verify-nin', 'POST', {nin}, false);
  }
}

export default new KycService();
