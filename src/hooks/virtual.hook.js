import {useMutation, useQuery} from '@tanstack/react-query';
import {_errorPrompt} from '../utils';
import virtualService from '../services/virtual.service';

/**
 *
 * @return {Promise<*>}
 * @private
 */
export const useGetVitualAcc = () => {
  return useQuery({
    queryKey: ['virtualAcc'],
    queryFn: async () => {
      const data = await virtualService.getVirtualAccount();
      return data;
    },
    staleTime: 1000 * 60,
    cacheTime: 1000 * 60 * 5,
    refetchOnWindowFocus: true,
    refetchInterval: 1000 * 60,
    retry: 1,
    onSuccess: data => {
      console.log('Account fetched:', data);
    },
    onError: error => {
      console.warn('Virtual account fetch error:', error.message);
    },
  });
};

/**
 *
 * @return {Promise<*>}
 * @private
 */
export const useGetVitualBalance = () => {
  return useQuery({
    queryKey: ['virtualBal'],
    queryFn: async () => {
      const data = await virtualService.getVirtualBalance();
      return data;
    },
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 30,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: (failureCount, error) => {
      if (
        error?.message?.includes('Too many OTP requests') ||
        error?.response?.data?.message?.includes('Too many OTP requests')
      ) {
        return false;
      }
      return failureCount < 3;
    },
    onSuccess: data => {
      console.log('Account balance fetched:', data);
    },
    onError: error => {
      _errorPrompt(error.message);
    },
  });
};

export const useGetReceiver = (recipient, fetchAuto = true) => {
  console.log('====================================');
  console.log(recipient);
  console.log('====================================');
  const isAccountNumber = /^\d+$/.test(recipient);
  const queryParam = isAccountNumber
    ? `accountNumber=${recipient}`
    : `username=${recipient}`;

  return useQuery({
    queryKey: ['RecieverAcc', recipient],
    queryFn: async () => {
      const data = await virtualService.getRecieverAcc(queryParam);

      return data;
    },

    onSuccess: data => {
      console.log('Account balance fetched:', data);
      return data;
    },
    onError: error => {
      _errorPrompt(error.message);
    },
    enabled: fetchAuto,
  });
};

/**
 *
 * @param {{accountNumber: string}{amount: number} } payload
 * @return {Promise<*>}
 * @private
 */
export const useTransfer = () => {
  return useMutation({
    mutationFn: payload => virtualService.transfer(payload),
    onSuccess: (data, variables) => {
      return data;
    },
    onError: error => {
      _errorPrompt(error.message);
    },
  });
};
