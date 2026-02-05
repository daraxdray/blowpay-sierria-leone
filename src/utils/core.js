import moment from "moment";
import Toast from "react-native-toast-message";




/**
 *
 * @returns array
 */
export const BirthYear = () => {
  let d = new Date();
  let year = new Date();
  let array = [];

  for (let i = 0; i < 100; i++) {
    year.setFullYear(d.getFullYear() - i);
    array.push({
      label: `${year.getFullYear()}`,
      value: `${year.getFullYear()}`,
    });
  }

  return array;
};


export const capitalizeText = (val) => {
  return (`${val}`)?.charAt(0).toUpperCase() + val.slice(1);
};


export const FilterDate = (val) => {
  let d = new Date();
  let t = new Date();

  if(val === "week"){
    const from = d.setDate(d.getDate() - 7);
    const data = {
      from: moment(from).format("YYYY/MM/DD"),
      to: moment().format("YYYY/MM/DD"),
    }
    return data;
  } else if(val === "month"){
    const data = {
      from: moment().format("YYYY/MM/01"),
      to: moment().format("YYYY/MM/DD"),
    }
    return data;
  } else if(val === "week"){
    const from = d.setDate(d.getDate() - 7);
    const data = {
      from: moment(from).format("YYYY/MM/DD"),
      to: moment().format("YYYY/MM/DD"),
    }
    return data;
  } else if(val === "last_month"){
    const from = d.setMonth(d.getMonth() - 1);
    const data = {
      from: moment(from).format("YYYY/MM/DD"),
      to: moment().format("YYYY/MM/DD"),
    }
    return data;
  } else if(val === "6_months") {
    const from = d.setMonth(d.getMonth() - 6);
    const data = {
      from: moment(from).format("YYYY/MM/DD"),
      to: moment().format("YYYY/MM/DD"),
    }
    return data;
  } else if(val === "12_months") {
    const from = d.setMonth(d.getMonth() - 12);
    const data = {
      from: moment(from).format("YYYY/MM/DD"),
      to: moment().format("YYYY/MM/DD"),
    }
    return data;
  } else {
    return null
  }

}


/** Lowercase string for matching; handles non-strings. */
const toMatchStr = (val) => (val && typeof val === 'string' ? val : String(val || '')).toLowerCase();

/** True if the message looks like a generic/unhelpful backend error (e.g. "failed with error 500"). */
export const isGenericServerErrorMessage = (message) => {
  const s = toMatchStr(message);
  if (!s) return true;
  const generic = [
    '500', '502', '503', '504',
    'internal server error',
    'bad gateway',
    'service unavailable',
    'gateway timeout',
    'failed with error',
    'request failed with status code',
    'error 500', 'error 502', 'error 503',
  ];
  return generic.some((term) => s.includes(term));
};

export const errorSeeker = (error) => {
  const raw = error && typeof error === 'string' ? error : String(error ?? '');
  const s = raw.toLowerCase();

  if (s.includes('network request failed')) return 'Check your connection and try again.';
  if (s.includes('invalid credentials')) return 'Email or password is incorrect.';
  if (s.includes("json parse error") || s.includes("unrecognized token '<'")) return 'Sorry, we\'re under maintenance. Please try again later.';
  if (s.includes('user not found') || s.includes('invalid or expired token')) return 'Session expired. Please log in again.';
  if (isGenericServerErrorMessage(raw)) return 'Something went wrong. Please try again.';
  return raw || 'Something went wrong. Please try again.';
};

/**
 * Returns a user-friendly error message from any error (Axios error, Error, or string).
 * Use this so users never see raw messages like "failed with error 500".
 */
export const getUserFriendlyErrorMessage = (error) => {
  if (error == null) return 'Something went wrong. Please try again.';

  const status = error.response?.status;
  const data = error.response?.data;
  const extracted =
    typeof data === 'string'
      ? data
      : (data && (data.message ?? data.error ?? data.msg ?? data.detail));
  const backendMsg = extracted != null ? String(extracted) : '';
  const fallback = error.message ? String(error.message) : String(error);

  const messageToCheck = backendMsg || fallback;

  if (status >= 500 || isGenericServerErrorMessage(messageToCheck)) {
    return 'Something went wrong. Please try again.';
  }
  if (status === 429) return 'Too many requests. Please wait a moment and try again.';
  if (status === 404) return 'The requested item was not found.';
  if (status === 403) return 'You don\'t have permission to do this.';
  if (status === 401) return 'Please log in again.';

  return errorSeeker(messageToCheck || fallback);
};

export const makeid = () =>{
  var length = 5;
  var result = "";
  var characters = "0123456789"
  var charactersLength = characters.length;

  for( var i = 0; i < length; i++){
      result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result;
}


export const formatCurrency = (num, currencySymbol) => {
  // console.log({num})
  try{
    let p = num?.toFixed(2)?.split(".") ?? 0.00;
    return `${currencySymbol ?? "₦"}` + p[0].split("").reverse().reduce(function(acc, num, i, orig) {
      return num + (num != "-" && i && !(i % 3) ? "," : "") + acc;
    }, "") + "." + p[1];
  } catch (e) {
    _errorPrompt("Something went wrong, formatCurrency-", e.message, );
    return 0.00;
  }
}


export const colors = [
  "#211a63",
  "#068f06",
  "#6b0568",
  "#C15D01",
  "#0670D1",
  "#E27C5B",
  "#F2A9E3",
  "#5E075F",
  "#FCAC12",
  "#00A86B",
]


export const _errorPrompt = (error, errorText) => {
  if (__DEV__) {
    console.log('error: ', error, errorText);
  }
  const errorMsg = getUserFriendlyErrorMessage(error ?? errorText);
  Toast.show({
    type: 'error',
    text1: 'Error',
    text2: errorMsg || errorText || 'Something went wrong. Please try again.',
  });
};


export const _successPrompt = (msg, msg2 = "") => {
  Toast.show({
    type: 'success',
    text1: msg,
    text2: msg2,
  });
};


/**
 *
 * @returns array of months
 */
// let expenseChart = [];
export const monthTree = () => {
  let monthData = [];

  for (let i = 0; i < 6; i++) {
    var d = new Date();
    d.setMonth(d.getMonth() - i);
    const filter = monthData.find(val => `${moment(d).format("MMM")}` === val);

    // console.log("filter:: ", filter, "moment:: ", moment(d).format("MMM"), "Date:: ", d);
    if(!filter){
      monthData.push(`${moment(d).format("MMM")}`);
    }
  }

  // console.log({monthData});
  return monthData;
};


//Abbreviate Amount into K and so on...
export const abbreviateNumber = (n) => {

  if (n < 1e3) return n;
  if (n >= 1e3 && n < 1e6) return +(n / 1e3).toFixed(1) + "K";
  if (n >= 1e6 && n < 1e9) return +(n / 1e6).toFixed(1) + "M";
  if (n >= 1e9 && n < 1e12) return +(n / 1e9).toFixed(1) + "B";
  if (n >= 1e12) return +(n / 1e12).toFixed(1) + "T";

  //   var newValue = value;
  // if (value >= 1000) {
  //     var suffixes = ["", "k", "m", "b","t"];
  //     var suffixNum = Math.floor( (""+value).length/3 );
  //     var shortValue = '';
  //     for (var precision = 2; precision >= 1; precision--) {
  //         shortValue = parseFloat( (suffixNum != 0 ? (value / Math.pow(1000,suffixNum) ) : value).toPrecision(precision));
  //         var dotLessShortValue = (shortValue + '').replace(/[^a-zA-Z 0-9]+/g,'');
  //         if (dotLessShortValue.length <= 2) { break; }
  //     }
  //     if (shortValue % 1 != 0)  shortValue = shortValue.toFixed(1);
  //     newValue = shortValue+suffixes[suffixNum];
  // }
  // console.log({newValue});
  // return newValue;
}



