import {useQuery, useMutation} from '@tanstack/react-query';
import billingServices from '../services/billing.service';
import {_errorPrompt} from '../utils';

export const useBpBillerProvider = id => {
  return useQuery({
    queryKey: ['billerProviders'],
    queryFn: async () => {
      const data = await billingServices.getBillerBpProviders();

      return data;
    },
    staleTime: 1000 * 60 * 2,
    cacheTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    retry: 1,
    onSuccess: data => {
      console.log('Biller Products fetched:', data);
      return data;
    },
    onError: error => {
      _errorPrompt(error);
    },
    enabled: !!id,
  });
};
export const useBpPerfomanceMetrics = () => {
  return useQuery({
    queryKey: ['servicePerformance'],
    queryFn: async () => {
      const response = await billingServices.BpPerfomanceMetrics();
      return response?.data?.data || [];
    },
    staleTime: 1000 * 60 * 2,
    cacheTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    retry: 1,
    onError: error => {
      _errorPrompt(error.message || 'Failed to fetch service performance');
    },
  });
};
export const useGetBpDataPlans = provider => {
  return useQuery({
    queryKey: ['BPDataPlans', provider],
    queryFn: async () => {
      if (!provider) {
        return [];
      }
      const response = await billingServices.getBpDataPlans(provider);
      console.log(response, 'response');

      return response || [];
    },
    staleTime: 1000 * 60 * 2,
    cacheTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    retry: 1,
    onError: error => {
      console.error('Failed to fetch Data Plans:', error.message || error);
    },
  });
};
export const useBpCheckMeter = () => {
  return useMutation({
    mutationFn: payload => billingServices.BpCheckMeter(payload),
    onSuccess: data => {
      if (data) {
        return data;
      }
    },
    onError: error => {
      // _errorPrompt(error);
    },
  });
};
export const useBpCheckCable = () => {
  return useMutation({
    mutationFn: payload => billingServices.bpCableValidate(payload),
    onSuccess: data => {
      if (data) {
        return data;
      }
    },
    onError: error => {
      // _errorPrompt(error);
    },
  });
};
export const useBpAirtime = () => {
  return useMutation({
    mutationFn: payload => billingServices.BpAirtime(payload),
    onSuccess: data => {
      if (data) {
        return data;
      }
    },
    onError: error => {
      _errorPrompt(error);
    },
  });
};
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
      _errorPrompt(error);
    },
    enabled: !!id,
  });
};
export const useBillerGetCable = provider => {
  return useQuery({
    queryKey: ['billerCables', provider],
    queryFn: async () => {
      if (!provider) {
        throw new Error('Provider is required');
      }
      const data = await billingServices.getBillerCables(provider);
      return data;
    },
    staleTime: 1000 * 60 * 2,
    cacheTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    retry: 1,
    enabled: !!provider,
    onSuccess: data => {
      console.log(`Cable products for ${provider} fetched successfully:`, data);
      return data;
    },
    onError: error => {
      _errorPrompt(error?.message || 'Failed to fetch cable products');
    },
  });
};

export const useGetSLCablePlans = ({enabled = true} = {}) => {
  return useQuery({
    queryKey: ['billerSLCables'],
    queryFn: async () => {
      const data = await billingServices.getSLCablesPlan();
      return data;
    },
    enabled,
    staleTime: 1000 * 60 * 2,
    cacheTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    retry: 1,
    onSuccess: data => {
      console.log('Cables Products fetched:', data);
      return data;
    },
    onError: error => {
      _errorPrompt(error);
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
      _errorPrompt(error);
    },
    enabled: !!id,
  });
};

export const useNbBillerProvider = id => {
  return useQuery({
    queryKey: ['billerProviders'],
    queryFn: async () => {
      const data = await billingServices.getBillerNbProviders();

      return data;
    },
    onSuccess: data => {
      console.log('Biller Products fetched:', data);
      return data;
    },
    onError: error => {
      _errorPrompt(error);
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
      _errorPrompt(error);
    },
  });
};

export const useFundWallet = () => {
  return useMutation({
    mutationFn: async amount => {
      const data = await billingServices.fundWallet(amount);
      return data;
    },
    onSuccess: data => {
      console.log('Wallet funded:', data);
      return data;
    },
    onError: error => {
      _errorPrompt(error);
    },
  });
};

export const useSpBillPayment = () => {
  return useMutation({
    mutationFn: async data => {
      return await billingServices.spBillPayment(data);
    },
  });
};
export const useBillValidate = () => {
  return useMutation({
    mutationFn: async data => {
      return await billingServices.billValidate(data);
    },
  });
};
export const useBettingValidate = () => {
  return useMutation({
    mutationFn: async data => {
      return await billingServices.verifyBettingWallet(data);
    },
  });
};

export const useBettingFund = () => {
  return useMutation({
    mutationFn: async data => {
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
    mutationFn: payload => billingServices.dataPay(payload),
    onSuccess: data => {
      if (data) {
        return data;
      }
    },
    onError: error => {
      _errorPrompt(error);
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
      _errorPrompt(error);
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
      _errorPrompt(error);
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
      _errorPrompt(error);
    },
  });
};

/**
 *
 * @param {} payload
 * @return {Promise<*>}
 * @private
 */
export const useSpValidateBill = () => {
  return useMutation({
    mutationFn: payload => billingServices.validateBilling(payload),
    onSuccess: data => {
      if (data) {
        return data;
      }
    },
    onError: error => {
      _errorPrompt(error);
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
      _errorPrompt(error);
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
      _errorPrompt(error);
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
      _errorPrompt(error);
    },
  });
};
