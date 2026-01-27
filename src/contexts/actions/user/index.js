import {
  CLEAR_USER,
  SET_HANDSHAKE,
  SET_STATE,
  SET_TOKEN,
  SET_USER,
  UPDATE_USER,
  LOGIN_SUCCESS,
  LOGOUT,
  SESSION_TIMEIN,
  SESSION_TIMEOUT,
  UPDATE_KYC,
} from './type';

export const setToken = payload => ({
  type: SET_TOKEN,
  payload,
});
export const updateKyc = payload => ({
  type: UPDATE_KYC,
  payload,
});

export const setUser = payload => ({
  type: SET_USER,
  payload,
});

export const updateUser = payload => ({
  type: UPDATE_USER,
  payload,
});

export const clearUser = () => ({
  type: CLEAR_USER,
});

export const setHandshake = payload => ({
  type: SET_HANDSHAKE,
  payload,
});

export const setState = payload => ({
  type: SET_STATE,
  payload,
});

// Action to handle successful login
export const loginSuccess = () => ({
  type: LOGIN_SUCCESS,
});

// Action to log out
export const logout = () => ({
  type: LOGOUT,
});

export const SessionActive = () => ({
  type: SESSION_TIMEIN,
});
export const SessionEnded = () => ({
  type: SESSION_TIMEOUT,
});
