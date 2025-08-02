import AsyncStorage from "@react-native-async-storage/async-storage";
import {
    CLEAR_USER,
    SET_HANDSHAKE,
    SET_LOADING,
    SET_STATE,
    SET_TOKEN,
    SET_USER,
    UPDATE_USER,
    LOGIN_SUCCESS,
    LOGOUT,
    SESSION_TIMEOUT,
    SESSION_TIMEIN
} from "../../actions/user/type";
import Toast from "react-native-toast-message";

//com.rdx.BillsByBlowmoney
const initialState = {
    accessToken: null,
    refreshToken: null,
    data: null,
    loading: false,
    handshake: null,
    state: null,
    isAuthenticated:false,
    isSession:false
};


export const userReducer = (state = initialState, action) => {
    const { type, payload } = action;
     
    switch (type) {
        case SET_TOKEN:
            return { ...state, accessToken: payload?.accessToken, refreshToken: payload?.refreshToken }

        case SET_USER:
            return { ...state, accessToken: payload?.accessToken, refreshToken: payload?.refreshToken, data: payload }

        case UPDATE_USER:
            return { ...state, data: { ...state.data, ...payload } }

        case CLEAR_USER:
            return {
                accessToken: null,
                refreshToken: null,
                data: null,
                loading: false,
                handshake: null,
                state: null,
            };

        case SET_HANDSHAKE:
            return { ...state, handshake: payload }

        case SET_LOADING:
            return { ...state, loading: payload }

        case SET_STATE:
            return { ...state, state: { ...state.state, ...payload } }
        case LOGIN_SUCCESS:

            return {
                ...state,
                loading: false,
                isAuthenticated: true,
                isSession:true

            };

        case LOGOUT:
            
            return {
                ...state,
                isAuthenticated: false,
                isSession:false

            };
            
        case SESSION_TIMEOUT:
            
            return {
                ...state,
                isSession:false
            };
        case SESSION_TIMEIN:
            
            return {
                ...state,
                isSession:true
            };

        default:
            return state;
    };
};
