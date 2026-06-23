import {useMutation} from '@tanstack/react-query';
import kycService from '../services/kyc.service';

export const useVerifyNin = () => {
  return useMutation({
    mutationFn: nin => kycService.verifyNin(nin),
  });
};
