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

    onSuccess: data => {
      console.log('user fetched:', data);
      return data;
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


// Hook for sending OTP
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
