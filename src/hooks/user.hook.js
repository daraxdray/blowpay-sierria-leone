import {useQuery, useMutation} from '@tanstack/react-query';
import {_errorPrompt, _successPrompt} from '../utils';
import userService from '../services/user.service';

/**
 *
 * @return {Promise<*>}
 * @private
 */
export const useGetUser = () => {
  return useQuery({
    queryKey: ['user-properties'],
    queryFn: async () => {
      const data = await userService.getUser();
      return data;
    },
    staleTime: 1000 * 60 * 5, // 5 mins
    cacheTime: 1000 * 60 * 10, // 10 mins
    refetchOnWindowFocus: false,
    onSuccess: data => {
      console.log('user fetched:', data);
      return data;
    },
    onError: error => {
      _errorPrompt(error.message);
    },
  });
};
export const useGetUserAcc = () => {
  return useQuery({
    queryKey: ['userVirtualAccount'],
    queryFn: async () => {
      const response = await userService.getUserAcc();
      return response?.data || {};
    },
    staleTime: 1000 * 60 * 5, // 5 mins
    cacheTime: 1000 * 60 * 10, // 10 mins
    refetchOnWindowFocus: false,
    retry: 1,
    onError: error => {
      _errorPrompt(error.message || 'Failed to fetch user virtual account');
    },
  });
};
export const useCreateUserAcc = () => {
  return useMutation({
    mutationFn: async payload => {
      const response = await userService.CreateAcc(payload);
      return response?.data;
    },
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
    onSuccess: data => {
      _successPrompt('Virtual account created successfully!');
      console.log('✅ Created Virtual Account:', data);
    },
    onError: error => {
      _errorPrompt(error.message || 'Failed to create virtual account');
    },
  });
};

/**
 *
 * @param {} payload
 * @return {Promise<*>}
 * @private
 */
export const useEditUser = () => {
  return useMutation({
    mutationFn: payload => userService.editUser(payload),
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

export const useSendOtp4Pin = () => {
  return useMutation({
    mutationFn: payload => userService.sendOtpForPin(),
    onSuccess: (data, variables) => {
      return data;
    },
    onError: error => {
      _errorPrompt(error.message);
    },
  });
};

// Hook for sending OTP
export const useOtpReset = () => {
  return useMutation({
    mutationFn: payload => userService.resetPasscode(payload),
    onSuccess: data => {
      return data;
    },
    onError: error => {
      _errorPrompt(error.message);
    },
  });
};
