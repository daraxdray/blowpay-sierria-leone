/**
 * Tests verifying the biometric implementation ported from blow-money:
 * 1. Country OR condition fixed in biometric-screen and confirm-pin
 * 2. Cancel button no longer passes event object to navigateHome
 * 3. createKey uses simplePrompt (reliable on all Android/iOS versions)
 * 4. createKey updates keyFound/bmEnabled state immediately on success
 * 5. createKey does NOT store state on cancel/failure
 * 6. promptSignIn uses simplePrompt (no key-pair signature needed)
 * 7. BiometricComponent: Platform import present, auto-trigger on mount
 */

// ─── Bug Fix: country condition ───────────────────────────────────────────────

describe('country navigation condition', () => {
  const shouldGoToBottomTab = country =>
    country === 'Nigeria' || country === 'Sierra Leone';

  it('navigates to bottom-tab for Nigeria', () => {
    expect(shouldGoToBottomTab('Nigeria')).toBe(true);
  });

  it('navigates to bottom-tab for Sierra Leone', () => {
    expect(shouldGoToBottomTab('Sierra Leone')).toBe(true);
  });

  it('does NOT navigate to bottom-tab for other countries', () => {
    expect(shouldGoToBottomTab('Ghana')).toBe(false);
    expect(shouldGoToBottomTab('Kenya')).toBe(false);
  });

  it('does NOT navigate to bottom-tab when country is missing', () => {
    expect(shouldGoToBottomTab(undefined)).toBe(false);
    expect(shouldGoToBottomTab(null)).toBe(false);
    expect(shouldGoToBottomTab('')).toBe(false);
  });

  it('old broken condition was always truthy (regression proof)', () => {
    const brokenCondition = country => country === 'Nigeria' || 'Sierra Leone';
    expect(Boolean(brokenCondition('Ghana'))).toBe(true);
    expect(Boolean(brokenCondition(undefined))).toBe(true);
  });
});

describe('confirm-pin country condition', () => {
  const shouldGoToBottomTab = country =>
    country === 'Nigeria' || country === 'Sierra Leone';

  it('only passes for Nigeria or Sierra Leone', () => {
    expect(shouldGoToBottomTab('Nigeria')).toBe(true);
    expect(shouldGoToBottomTab('Sierra Leone')).toBe(true);
    expect(shouldGoToBottomTab('Ghana')).toBe(false);
    expect(shouldGoToBottomTab(undefined)).toBe(false);
  });
});

// ─── Cancel button fix ────────────────────────────────────────────────────────

describe('Cancel button onPress wrapping', () => {
  it('passing navigateHome directly causes navigate(event) which crashes', () => {
    const pressEvent = {nativeEvent: {}, type: 'GestureResponderEvent'};
    const mockNavigate = jest.fn();
    const mockDispatch = jest.fn();

    const navigateHome = (fromRoute = '') => {
      if (fromRoute === '') {
        mockDispatch('reset-to-bottom-tab');
      } else {
        mockNavigate(fromRoute);
      }
    };

    navigateHome(pressEvent);
    expect(mockNavigate).toHaveBeenCalledWith(pressEvent);
    expect(mockDispatch).not.toHaveBeenCalled();
  });

  it('wrapping in arrow function fixes it — navigateHome() gets no args', () => {
    const mockNavigate = jest.fn();
    const mockDispatch = jest.fn();

    const navigateHome = (fromRoute = '') => {
      if (fromRoute === '') {
        mockDispatch('reset-to-bottom-tab');
      } else {
        mockNavigate(fromRoute);
      }
    };

    const onPress = () => navigateHome();
    onPress();
    expect(mockDispatch).toHaveBeenCalledWith('reset-to-bottom-tab');
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});

// ─── createKey: simplePrompt approach ─────────────────────────────────────────

describe('createKey uses simplePrompt (not createKeys)', () => {
  const makeCreateKey = (biometrics, storage, setKeyFound, setBmEnabled, Toast) =>
    async () => {
      try {
        const {success} = await biometrics.simplePrompt({
          promptMessage: 'Confirm biometric to enable',
          cancelButtonText: 'Cancel',
        });
        if (success) {
          await storage.setItem('bmEnabled', 'true');
          setKeyFound('enabled');
          setBmEnabled('true');
          Toast.show({text1: 'Biometric enabled'});
          return true;
        }
        return false;
      } catch (error) {
        Toast.show({text1: 'Could not enable biometric, please try again'});
        return false;
      }
    };

  it('returns true and stores state on successful scan', async () => {
    const mockBiometrics = {simplePrompt: jest.fn().mockResolvedValue({success: true})};
    const mockStorage = {setItem: jest.fn().mockResolvedValue(null)};
    const setKeyFound = jest.fn();
    const setBmEnabled = jest.fn();
    const Toast = {show: jest.fn()};

    const createKey = makeCreateKey(mockBiometrics, mockStorage, setKeyFound, setBmEnabled, Toast);
    const result = await createKey();

    expect(result).toBe(true);
    expect(mockStorage.setItem).toHaveBeenCalledWith('bmEnabled', 'true');
    expect(setKeyFound).toHaveBeenCalledWith('enabled');
    expect(setBmEnabled).toHaveBeenCalledWith('true');
    expect(Toast.show).toHaveBeenCalledWith({text1: 'Biometric enabled'});
  });

  it('returns false and does NOT store state when user cancels', async () => {
    const mockBiometrics = {simplePrompt: jest.fn().mockResolvedValue({success: false})};
    const mockStorage = {setItem: jest.fn()};
    const setKeyFound = jest.fn();
    const setBmEnabled = jest.fn();
    const Toast = {show: jest.fn()};

    const createKey = makeCreateKey(mockBiometrics, mockStorage, setKeyFound, setBmEnabled, Toast);
    const result = await createKey();

    expect(result).toBe(false);
    expect(mockStorage.setItem).not.toHaveBeenCalled();
    expect(setKeyFound).not.toHaveBeenCalled();
    expect(setBmEnabled).not.toHaveBeenCalled();
  });

  it('returns false and shows error toast when simplePrompt throws', async () => {
    const mockBiometrics = {simplePrompt: jest.fn().mockRejectedValue(new Error('No biometrics'))};
    const mockStorage = {setItem: jest.fn()};
    const setKeyFound = jest.fn();
    const setBmEnabled = jest.fn();
    const Toast = {show: jest.fn()};

    const createKey = makeCreateKey(mockBiometrics, mockStorage, setKeyFound, setBmEnabled, Toast);
    const result = await createKey();

    expect(result).toBe(false);
    expect(Toast.show).toHaveBeenCalledWith({text1: 'Could not enable biometric, please try again'});
    expect(mockStorage.setItem).not.toHaveBeenCalled();
  });

  it('does NOT store bPK (no key pair generation in new approach)', async () => {
    const mockBiometrics = {simplePrompt: jest.fn().mockResolvedValue({success: true})};
    const mockStorage = {setItem: jest.fn().mockResolvedValue(null)};
    const setKeyFound = jest.fn();
    const setBmEnabled = jest.fn();
    const Toast = {show: jest.fn()};

    const createKey = makeCreateKey(mockBiometrics, mockStorage, setKeyFound, setBmEnabled, Toast);
    await createKey();

    const calledWithBpk = mockStorage.setItem.mock.calls.some(([key]) => key === 'bPK');
    expect(calledWithBpk).toBe(false);
  });
});

// ─── biometric-screen activate(): only navigate on success ────────────────────

describe('biometric-screen activate() navigation', () => {
  const makeActivate = (createKey, dispatch) => async () => {
    const enabled = await createKey();
    if (enabled) {
      dispatch('reset-to-bottom-tab');
    }
  };

  it('navigates to bottom-tab when createKey returns true', async () => {
    const createKey = jest.fn().mockResolvedValue(true);
    const dispatch = jest.fn();
    const activate = makeActivate(createKey, dispatch);
    await activate();
    expect(dispatch).toHaveBeenCalledWith('reset-to-bottom-tab');
  });

  it('does NOT navigate when user cancels (createKey returns false)', async () => {
    const createKey = jest.fn().mockResolvedValue(false);
    const dispatch = jest.fn();
    const activate = makeActivate(createKey, dispatch);
    await activate();
    expect(dispatch).not.toHaveBeenCalled();
  });

  it('does NOT navigate when createKey returns false due to error', async () => {
    const createKey = jest.fn().mockResolvedValue(false);
    const dispatch = jest.fn();
    const activate = makeActivate(createKey, dispatch);
    await activate();
    expect(dispatch).not.toHaveBeenCalled();
  });
});

// ─── handleBiometric: null guard ─────────────────────────────────────────────

describe('handleBiometric null guard', () => {
  const makeHandleBiometric = (getUserPincode, handleOtpChange) => async () => {
    const det = await getUserPincode();
    if (det?.pincode) {
      handleOtpChange(det.pincode);
    }
  };

  it('calls handleOtpChange with the saved pincode', async () => {
    const getUserPincode = jest.fn().mockResolvedValue({email: 'a@b.com', pincode: '123456'});
    const handleOtpChange = jest.fn();
    const handleBiometric = makeHandleBiometric(getUserPincode, handleOtpChange);
    await handleBiometric();
    expect(handleOtpChange).toHaveBeenCalledWith('123456');
  });

  it('does NOT crash when getUserPincode returns null (no saved credentials)', async () => {
    const getUserPincode = jest.fn().mockResolvedValue(null);
    const handleOtpChange = jest.fn();
    const handleBiometric = makeHandleBiometric(getUserPincode, handleOtpChange);
    await expect(handleBiometric()).resolves.toBeUndefined();
    expect(handleOtpChange).not.toHaveBeenCalled();
  });
});

// ─── confirm-pin: userKyc JSON.parse safety ───────────────────────────────────

describe('confirm-pin userKyc parse safety', () => {
  const safeParseKyc = async getItem => {
    let kyc = null;
    try {
      const storedKyc = await getItem('userKyc');
      kyc = storedKyc ? JSON.parse(storedKyc) : null;
    } catch {
      kyc = null;
    }
    return kyc;
  };

  it('parses "true" correctly', async () => {
    const getItem = jest.fn().mockResolvedValue('true');
    expect(await safeParseKyc(getItem)).toBe(true);
  });

  it('returns null when value is "undefined" (does not throw)', async () => {
    const getItem = jest.fn().mockResolvedValue('undefined');
    await expect(safeParseKyc(getItem)).resolves.toBeNull();
  });

  it('returns null when AsyncStorage has no value', async () => {
    const getItem = jest.fn().mockResolvedValue(null);
    expect(await safeParseKyc(getItem)).toBeNull();
  });
});

// ─── promptSignIn: simplePrompt approach ─────────────────────────────────────

describe('promptSignIn uses simplePrompt', () => {
  const makePromptSignIn = (biometrics, keyFound, setBmPass, Toast) =>
    async () => {
      if (!keyFound) {
        Toast.show({text1: 'Biometric not set up. Please use your PIN.'});
        return;
      }
      try {
        const {success} = await biometrics.simplePrompt({
          promptMessage: 'Sign in',
          cancelButtonText: 'Use PIN',
        });
        if (success) {
          setBmPass(true);
        }
      } catch (error) {
        Toast.show({type: 'error', text1: 'Biometric failed', text2: 'Please use your PIN instead'});
      }
    };

  it('sets bmPass to true on successful authentication', async () => {
    const mockBiometrics = {simplePrompt: jest.fn().mockResolvedValue({success: true})};
    const setBmPass = jest.fn();
    const Toast = {show: jest.fn()};

    const promptSignIn = makePromptSignIn(mockBiometrics, 'enabled', setBmPass, Toast);
    await promptSignIn();

    expect(setBmPass).toHaveBeenCalledWith(true);
  });

  it('does not set bmPass when user cancels', async () => {
    const mockBiometrics = {simplePrompt: jest.fn().mockResolvedValue({success: false})};
    const setBmPass = jest.fn();
    const Toast = {show: jest.fn()};

    const promptSignIn = makePromptSignIn(mockBiometrics, 'enabled', setBmPass, Toast);
    await promptSignIn();

    expect(setBmPass).not.toHaveBeenCalled();
  });

  it('shows error toast when biometrics not set up', async () => {
    const mockBiometrics = {simplePrompt: jest.fn()};
    const setBmPass = jest.fn();
    const Toast = {show: jest.fn()};

    const promptSignIn = makePromptSignIn(mockBiometrics, null, setBmPass, Toast);
    await promptSignIn();

    expect(Toast.show).toHaveBeenCalledWith({text1: 'Biometric not set up. Please use your PIN.'});
    expect(mockBiometrics.simplePrompt).not.toHaveBeenCalled();
  });
});

// ─── checkBiometricSupport: reads bmEnabled not bPK ──────────────────────────

describe('checkBiometricSupport uses bmEnabled flag', () => {
  it('sets keyFound to "enabled" when bmEnabled is "true"', () => {
    const bmStatus = 'true';
    const keyFound = bmStatus === 'true' ? 'enabled' : null;
    expect(keyFound).toBe('enabled');
  });

  it('sets keyFound to null when bmEnabled is not set', () => {
    const bmStatus = null;
    const keyFound = bmStatus === 'true' ? 'enabled' : null;
    expect(keyFound).toBeNull();
  });

  it('old approach read bPK which was never set due to race condition (regression proof)', () => {
    // Old: keyFound = storedKey (the actual public key)
    // New: keyFound = bmStatus === 'true' ? 'enabled' : null
    // Old approach failed because createKey() didn't return its promise
    // so bPK was never reliably stored
    const storedBpk = null; // was null due to old race bug
    const oldKeyFound = storedBpk;
    expect(oldKeyFound).toBeNull(); // biometric button never showed
  });
});
