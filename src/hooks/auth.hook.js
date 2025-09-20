import {useMutation, QueryClient, useQuery} from '@tanstack/react-query';
import authServices from '../services/auth.services';

const queryClient = new QueryClient(); // Initialize query client

export const useRegisterUser = () => {
  return useMutation({
    mutationFn: payload => authServices.register(payload),
  });
};

/**
 *
 * @param {{emailAddress: string, password: string}} payload
 * @return {Promise<*>}
 * @private
 */
export const useLogin = () => {
  return useMutation({
    mutationFn: payload => authServices.login(payload),
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
 * @param {{emailAddress: string}} payload
 * @return {Promise<*>}
 * @private
 */
// Hook for sending OTP
export const useVerifyOtp = () => {
  return useMutation({
    mutationFn: payload => authServices.verifyOtp(payload),
    onSuccess: data => {
      return data;
    },
    onError: error => {
      _errorPrompt(error.message);
    },
  });
};

/**
 *
 * @param {{emailAddress: string}} payload
 * @return {Promise<*>}
 * @private
 */
// Hook for sending OTP
export const useSendOtp = () => {
  return useMutation({
    mutationFn: payload => authServices.resendOtp(payload),
    onSuccess: (data, variables) => {
      return data;
    },
    onError: error => {
      _errorPrompt(error.message);
    },
  });
};
// Hook for checking website statsu
export const useCheckServerStatus = () => {
  return useQuery({
    queryKey: ['serverStatus'],
    queryFn: async () => {
      const data = await authServices.getServerStatus();

      return data;
    },
    onSuccess: data => {
      console.log('Server status Products fetched:', data);
      return data;
    },
    onError: error => {
      _errorPrompt(error.message);
    },
    // enabled: !!id,
  });
};

/**
 *
 * @param {{emailAddress: string}} payload
 * @return {Promise<*>}
 * @private
 */
// Hook for sending OTP
export const useSetPasscode = () => {
  return useMutation({
    mutationFn: payload => authServices.setPasscode(payload),
    onSuccess: (data, variables) => {
      return data;
    },
    onError: error => {
      _errorPrompt(error.message);
    },
  });
};
/**
 *
 * @param {{emailAddress: string}} payload
 * @return {Promise<*>}
 * @private
 */
// Hook for sending OTP
export const useConfirmPasscode = () => {
  return useMutation({
    mutationFn: payload => authServices.confirmPasscode(payload),
    onSuccess: (data, variables) => {
      return data;
    },
    onError: error => {
      _errorPrompt(error.message);
    },
  });
};
export const useLoginPasscode = () => {
  return useMutation({
    mutationFn: payload => authServices.loginPasscode(payload),
    onSuccess: (data, variables) => {
      return data;
    },
    onError: error => {
      _errorPrompt(error.message);
    },
  });
};

/**
 *
 * @param {{emailAddress: string}} payload
 * @return {Promise<*>}
 * @private
 */
export const useForgotPassword = () => {
  return useMutation({
    mutationFn: payload => authServices.forgotPassword(payload),
    onSuccess: data => {
      return data;
    },
    onError: error => {
      _errorPrompt(error.message);
    },
  });
};

/**
 *
 * @param {{token: string, id: string, password: string}} payload
 * @return {Promise<*>}
 * @private
 */
export const useResetPassword = () => {
  return useMutation({
    mutationFn: payload => authServices.resetPassword(payload),
    onSuccess: data => {
      return data;
    },
    onError: error => {
      _errorPrompt(error.message);
    },
  });
};

/**
 *
 * @return {Promise<*>}
 * @private
 */
export const useLogout = () => {
  return useMutation({
    mutationFn: () => authServices.logout(),
    onSuccess: d => {
      return d;
    },
    onError: error => {
      _errorPrompt(error.message);
    },
  });
};

/**
 *
 * @param {{oldPassword: string, newPassword: string}} payload
 * @return {Promise<*>}
 * @private
 */
export const useChangePassword = () => {
  return useMutation({
    mutationFn: payload => authServices.changePassword(payload),
    onSuccess: data => {
      return data;
    },
    onError: error => {
      _errorPrompt(error.message);
    },
  });
};

export const useKYC = () => {
  return useMutation({
    mutationFn: payload => authServices.KYC(payload),
    onSuccess: (data, variables) => {
      return data;
    },
    onError: error => {
      console.error('KYC Error:', error);

      _errorPrompt(error.message);
    },
  });
};

export const useUpdateUser = () => {
  return useMutation({
    mutationFn: payload => authServices.updateUser(payload),
    onSuccess: (data, variables) => {
      return data;
    },
    onError: error => {
      _errorPrompt(error.message);
    },
  });
};
