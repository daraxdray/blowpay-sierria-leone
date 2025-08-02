import {useMutation, useQuery} from '@tanstack/react-query';
import {_errorPrompt, _successPrompt} from '../utils';
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
      
      try{
        const data = await virtualService.getVirtualAccount();
        
        return data;  

      }catch(err){
        console.log(err);
        return null
      }
      console.log("+=====+++++++++++++++++++")
    },

    onSuccess: data => {
      console.log('Account fetched:', data);
      return data;
    },
    onError: error => {
      console.warn("ERRROR")
      _errorPrompt(error.message);
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

    onSuccess: data => {
      console.log('Account balance fetched:', data);
      return data;
    },
    onError: error => {
      _errorPrompt(error.message);
    },
  });
};

export const useGetReceiver = (recipient,fetchAuto = true) => {
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
    enabled:fetchAuto
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
