



import {useQuery, useMutation} from '@tanstack/react-query';
import {_errorPrompt, _successPrompt} from '../utils';
import constantsService from '../services/constants.service';


/**
 *
 * @return {Promise<*>}
 * @private
 */
export const useGetConstant = () => {
  return useQuery({
    queryKey: ['constants'],
    queryFn: async () => {
      const data = await constantsService.getConstants();
      
      return data;
    },

    onSuccess: data => {
      console.log('constant fetched:', data);
      return data;
    },
    onError: error => {
      _errorPrompt(error);
    },
  });
};
