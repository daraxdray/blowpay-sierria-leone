// import {API_URL, BASE_URL} from '@env';
// import CookieManager from '@react-native-cookies/cookies';
import axios from 'axios';

/**
 * Object Request Header
 */
export const requestHeader = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
};

/**
 * Function to make HTTP requests with cookie handling
 * @param {string} url - Endpoint URL
 * @param {string} method - HTTP method (GET, POST, PATCH, etc.)
 * @param {Object} payload - Request body data
 * @param {boolean} token - Whether to include authorization token (if required)
 * @param {boolean} text - Whether to return plain text response
 * @param {boolean} form - Whether the request contains form data
 * @returns {Promise<Object>} - Response data or error
 */
// export async function request(url, method, payload = {}, form = false) {
//   const fullUrl = 'https://api.blowcloud.org/v1' + url;

//   try {

//     let cookies;
//     // console.log("=========================KNOW=============",Platform.OS)
//     // Get cookies for the BASE_URL
//     if(Platform.OS == "android"){
//        cookies = await CookieManager.get('https://api.blowcloud.org');
//       //  console.log(typeof(cookies),"================+ANDROID COOKIE TYPE ",cookies)
//     }else{

//       cookies = await CookieManager.getAll(true);
//     }

//     if (cookies) {
//       // Set cookies in request headers
//       requestHeader['Cookie'] = Object.entries(cookies)
//         .map(([name, value]) => `${name}=${value}`)
//         .join('; ');
//     }

//     // Adjust content type for form data if needed
//     requestHeader['Content-Type'] = form
//       ? 'multipart/form-data'
//       : 'application/json';

//     // Create the fetch request options
//     const fetchOptions = {
//       method,
//       headers: { ...requestHeader },
//     };

//     // console.log(fetchOptions, 'fetchOptions');
//     // console.warn(url);
//     // Add body for non-GET requests
//     if (method !== 'GET') {
//       fetchOptions.body = form ? payload : JSON.stringify(payload);
//     }

//     // Make the fetch call
//     const res = await fetch(fullUrl, fetchOptions);

//     // Save cookies from the response if any
//     const setCookieHeader = res.headers.get('Set-Cookie');
//     // console.log("========================================");
//     // console.log("========================================");
//     // console.log("==========SHOW COOKIE HEADERS========================");
//     // console.log(res.headers);
//     if (setCookieHeader) {
//       console.log(setCookieHeader);
//       // console.log("========================================");
//       // console.log("========================================");
//       // console.log("========================================");
//       // console.log("========================================");
//       // console.log("========================================");
//       await CookieManager.setFromResponse(fullUrl, setCookieHeader);
//       // console.log("========================================");
//       // console.log(res);
//     }
//     return res;
//   } catch (err) {
//     // console.log(err, 'bad respons3');
//     // Handle and log errors
//     const errMsg = errorSeeker(`${err}`);
//     _errorPrompt(errMsg);
//     // console.log(`Request Error at ${url}: `, err);
//     return err;
//   }
// }

export const baseUrl = 'https://api.blowcloud.org/v1';
// const baseUrl = 'https://648b-196-1-187-34.ngrok-free.app/v1';

export async function request(url, method, payload = {}, form = false) {
  const fullUrl = `${baseUrl}${url}`;
  // console.warn(fullUrl);
  // Configure axios instance
  const axiosInstance = axios.create({
    baseURL: baseUrl,
    withCredentials: true, // Automatically send cookies with requests
    headers: {
      'Content-Type': form ? 'multipart/form-data' : 'application/json',
    },
  });

  axiosInstance.interceptors.request.use(
    config => {
      console.log('Request Headers:', config.headers);
      return config;
    },
    error => {
      console.error('Request Error:', error);
      return Promise.reject(error);
    },
  );

  // axiosInstance.interceptors.request
  try {
    // Define axios request config
    const config = {
      method,
      url: fullUrl,
      // headers: {},
    };

    // Add data for non-GET requests
    if (method !== 'GET') {
      config.data = form ? payload : JSON.stringify(payload);
    }
    // Make axios request
    const response = await axiosInstance(config);

    // Automatically handles cookies, but if you need to set cookies manually
    // You can use below code to manually set cookies if needed
    const setCookieHeader = response.headers['set-cookie'];
    if (setCookieHeader) {
      // console.warn('Set-Cookie Header:', setCookieHeader);
    } else {
      // console.warn('Headers:', response.headers);
    }
    return response.data;
  } catch (err) {
    console.error(`Request Error Data at ${url}: `, err.response.data);
    //handle logout when request does not authorize;
    if (
      err.response.status === 401 &&
      err.response?.data?.message === 'Unauthorized'
    ) {
      return err.response.data;
    }
    throw err;
  }
}
