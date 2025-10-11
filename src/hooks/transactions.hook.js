import {useMutation, useQuery} from '@tanstack/react-query';
import {_errorPrompt} from '../utils';
import transactionService from '../services/transaction.service';

/**
 *
 * @return {Promise<*>}
 * @private
 */
export const useGetTransactions = description => {
  return useQuery({
    queryKey: [description],
    queryFn: async () => {
      const data = await transactionService.getTransactions(description);
      return data;
    },
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 30,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    onSuccess: data => {
      console.log('Transactions fetched:', data);
      return data;
    },
    onError: error => {
      console.log('ERRORORORORORO');
      _errorPrompt(error.message);
    },
  });
};
export const useGetTransaction = id => {
  return useQuery({
    queryKey: ['Transaction', id],
    queryFn: async () => {
      const data = await transactionService.getTransaction(id);

      return data;
    },

    onSuccess: data => {
      console.log('Transactions fetched:', data);
      return data;
    },
    onError: error => {
      _errorPrompt(error.message);
    },
  });
};

/**
 *
 * @param {string} id
 * @return {Promise<*>}
 * @private
 */
export const useGetNotificationById = id => {
  return useQuery({
    queryKey: ['Transaction', id],
    queryFn: () => transactionService.getTransById(id),
    onSuccess: data => {
      console.log('Transactions fetched:', data);
      return data;
    },
    onError: error => {
      _errorPrompt(error.message);
    },
    enabled: !!id,
  });
};

export const useGetTxToken = () => {
  return useMutation({
    mutationFn: id => transactionService.getTxToken(id),
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
