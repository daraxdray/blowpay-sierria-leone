// import CookieManager from '@react-native-cookies/cookies';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {baseUrl, requestHeader} from '../services/api';
// import { API_URL, BASE_URL } from "@env";
import * as Keychain from 'react-native-keychain';

// export const getCookie = async() => {
//     const cookies = await CookieManager.get(BASE_URL);
//     if (cookies) {
//         console.log({cookies});
//         return Object.entries(cookies)
//             .map(([name, value]) => `${name}=${value}`)
//             .join("; ");
//     } else {
//         return false;
//     }
// }

export const saveUserCredentials = async (email, pincode) => {
  let options = {
    service: baseUrl + email,
    accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED,
    securityLevel: Keychain.SECURITY_LEVEL.SECURE_HARDWARE,
  };

  try {
    const r = await Keychain.setGenericPassword(email, pincode, options);
    console.log('✅ Credentials saved securely (hardware):', r);
    return true;
  } catch (error) {
    if (String(error).includes('CryptoFailedException')) {
      console.warn('⚠️ Secure hardware not available, falling back to ANY');
      options.securityLevel = Keychain.SECURITY_LEVEL.ANY;
      const r = await Keychain.setGenericPassword(email, pincode, options);
      console.log('✅ Credentials saved securely (software):', r);
      return true;
    }
    console.error('❌ Failed to save credentials:', error);
    return false;
  }
};

/**
 * Retrieves the user's saved pincode securely.
 * @returns {Promise<{email: string, pincode: string} | null>} - Returns the saved email and pincode, or null if not found.
 */
export const getUserPincode = async () => {
  const email = await AsyncStorage.getItem('authEmail');
  try {
    // Retrieve the credentials from Keychain
    const credentials = await Keychain.getGenericPassword({
      service: baseUrl + email, // Match the service name used in saveUserCredentials
    });

    if (credentials) {
      console.log('Retrieved credentials:', credentials);
      return {
        email: credentials.username,
        pincode: credentials.password,
      };
    } else {
      console.log('No credentials stored');
      return null;
    }
  } catch (error) {
    console.error('Failed to retrieve credentials:', error);
    return null;
  }
};

/**
 * Deletes the saved user's email and pincode.
 * @returns {Promise<boolean>} - Returns true if deletion was successful, false otherwise.
 */
export const deleteUserCredentials = async () => {
  try {
    // Delete the saved credentials
    const result = await Keychain.resetGenericPassword({
      service: 'com.yourapp.usercredentials',
    });

    if (result) {
      console.log('Credentials successfully deleted');
      return true;
    } else {
      console.log('No credentials found to delete');
      return false;
    }
  } catch (error) {
    console.error('Failed to delete credentials:', error);
    return false;
  }
};
