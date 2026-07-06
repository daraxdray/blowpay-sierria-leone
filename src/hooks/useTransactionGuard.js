import {useRef, useCallback} from 'react';

// Shared submission lock so manual PIN entry and biometric auth on the same
// screen can never both trigger the payment/login mutation at once.
const useTransactionGuard = () => {
  const isSubmittingRef = useRef(false);

  const canSubmit = useCallback(() => !isSubmittingRef.current, []);
  const begin = useCallback(() => {
    isSubmittingRef.current = true;
  }, []);
  const end = useCallback(() => {
    isSubmittingRef.current = false;
  }, []);

  return {canSubmit, begin, end};
};

export default useTransactionGuard;
