import {useQuery, useMutation} from '@tanstack/react-query';
import billingServices from '../services/billing.service'; // Import your notification services
import {_errorPrompt, _successPrompt} from '../utils'; // Import utilities

/**
 *
 * @param {string} id
 * @return {Promise<*>}
 * @private
 */
export const useBillerProducts = id => {
  return useQuery({
    queryKey: ['billerProducts', id],
    queryFn: async () => {
      const data = await billingServices.getBillerProducts(id);
      
      return data;
    },
    onSuccess: data => {
      console.log('Biller Products fetched:', data);
      return data;
    },
    onError: error => {
      _errorPrompt(error.message);
    },
    enabled: !!id,
  });
};
export const useBillerGetCable = () => {
  return useQuery({
    queryKey: ['billerCables'],
    queryFn: async () => {
      const data = await billingServices.getBillerCables();
      
      return data;
    },
    onSuccess: data => {
      console.log('Cables Products fetched:', data);
      return data;
    },
    onError: error => {
      _errorPrompt(error.message);
    },
    
  });
};
export const useBillerByCategory = id => {
  return useQuery({
    queryKey: ['billerBycategory', id],
    queryFn: async () => {
      const data = await billingServices.getBillerProductsByCategory(id);
      
      return data;
    },
    onSuccess: data => {
      console.log('Biller Products fetched:', data);
      return data;
    },
    onError: error => {
      _errorPrompt(error.message);
    },
    enabled: !!id,
  });
};

export const useNbBillerProvider = id => {
  return useQuery({
    queryKey: ['billerProviders',],
    queryFn: async () => {
      const data = await billingServices.getBillerNbProviders();
      
      return data;
    },
    onSuccess: data => {
      console.log('Biller Products fetched:', data);
      return data;
    },
    onError: error => {
      _errorPrompt(error.message);
    },
    enabled: !!id,
  });
};
export const useBpBillerProvider = id => {
  return useQuery({
    queryKey: ['billerProviders',],
    queryFn: async () => {
      const data = await billingServices.getBillerBpProviders();
      
      return data;
    },
    onSuccess: data => {
      console.log('Biller Products fetched:', data);
      return data;
    },
    onError: error => {
      _errorPrompt(error.message);
    },
    enabled: !!id,
  });
};

export const useBillerGetBetting = () => {
  return useQuery({
    queryKey: ['billerBetting'],
    queryFn: async () => {
      const data = await billingServices.getBillerBetting();
      return data;
    },
    onSuccess: data => {
      console.log('Betting Providers fetched:', data);
      return data;
    },
    onError: error => {
      _errorPrompt(error.message);
    },
  });
};

export const useBettingValidate = () => {
  return useMutation({
    mutationFn: async (data) => {
      return await billingServices.verifyBettingWallet(data);
    },
  });
};

export const useBettingFund = () => {
  return useMutation({
    mutationFn: async (data) => {
      return await billingServices.fundBettingWallet(data);
    },
  });
};

/**
 *
 * @param {} payload
 * @return {Promise<*>}
 * @private
 */
export const useBillPay = () => {
  return useMutation({
    mutationFn: payload => billingServices.billPay(payload),
    onSuccess: data => {
      if (data) {
        return data;
      }
    },
    onError: error => {
      _errorPrompt(error.message);
    },
  });
};
export const useCablePay = () => {
  return useMutation({
    mutationFn: payload => billingServices.cablePay(payload),
    onSuccess: data => {
      if (data) {
        return data;
      }
    },
    onError: error => {
      _errorPrompt(error.message);
    },
  });
};

export const useNbBillPay = () => {
  return useMutation({
    mutationFn: payload => billingServices.nbbillPay(payload),
    onSuccess: data => {
      if (data) {
        return data;
      }
    },
    onError: error => {
      _errorPrompt(error.message);
    },
  });
};
export const useByPBillPay = () => {
  return useMutation({
    mutationFn: payload => billingServices.bpbillPay(payload),
    onSuccess: data => {
      if (data) {
        return data;
      }
    },
    onError: error => {
      _errorPrompt(error.message);
    },
  });
};

/**
 *
 * @param {} payload
 * @return {Promise<*>}
 * @private
 */
export const useBillValidate = () => {
  return useMutation({
    mutationFn: payload => billingServices.billValidate(payload),
    onSuccess: data => {
      if (data) {
        return data;
      }
    },
    onError: error => {
      _errorPrompt(error.message);
    },
  });
};
export const useCableValidate = () => {
  return useMutation({
    mutationFn: payload => billingServices.nbCableValidate(payload),
    onSuccess: data => {
      if (data) {
        return data;
      }
    },
    onError: error => {
      _errorPrompt(error.message);
    },
  });
};

export const useNbBillValidate = () => {
  return useMutation({
    mutationFn: payload => billingServices.nbBillValidate(payload),
    onSuccess: data => {
      if (data) {
        return data;
      }
    },
    onError: error => {
      _errorPrompt(error.message);
    },
  });
};
export const useBpBillValidate = () => {
  return useMutation({
    mutationFn: payload => billingServices.bpBillValidate(payload),
    onSuccess: data => {
      if (data) {
        return data;
      }
    },
    onError: error => {
      _errorPrompt(error.message);
    },
  });
};
