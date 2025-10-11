export const formatAmount = value => {
  let cleanedValue = value.replace(/[^0-9.]/g, '');
  let [integer, decimal] = cleanedValue.split('.');
  if (integer) {
    integer = integer.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
  return decimal ? `${integer}.${decimal}` : integer;
};

export const removeCommas = val => val.replace(/,/g, '');

export const unformatAmount = formattedValue => {
  if (!formattedValue) {
    return '0';
  }
  return String(formattedValue).replace(/,/g, '');
};

export const getCurrencySymbol = country => {
  if (country === 'Sierra Leone') {
    return 'SLE ';
  }
  return 'NGN ';
};

export const showToast = (
  setToastMessage,
  setToastType,
  setToastVisible,
  message,
  type,
) => {
  setToastMessage(message);
  setToastType(type);
  setToastVisible(true);

  setTimeout(() => {
    setToastVisible(false);
  }, 3000);
};

export const checkUserBalance = (
  userBalance,
  amount,
  navigation,
  showToastFn,
) => {
  if (userBalance < amount) {
    const screenError = 'Insufficient funds. Please top up your account.';
    if (showToastFn) {
      showToastFn(screenError);
    }
    navigation.navigate('PaymentError', {screenError});
    return false;
  }
  return true;
};

export const formatSierraLeoneNumber = val => {
  let digits = val.replace(/\D/g, '');
  if (digits.startsWith('232')) {
    digits = digits.slice(3);
  }
  digits = digits.slice(0, 8);
  if (digits.length > 5) {
    return `+232 ${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(
      5,
    )}`;
  } else if (digits.length > 2) {
    return `+232 ${digits.slice(0, 2)} ${digits.slice(2)}`;
  } else if (digits.length > 0) {
    return `+232 ${digits}`;
  }

  return '+232 ';
};

const prefixRules = {
  Nigeria: {
    MTN: [
      '0803',
      '0806',
      '0703',
      '0706',
      '0810',
      '0813',
      '0814',
      '0816',
      '0903',
      '0906',
      '0913',
      '0916',
    ],
    GLO: ['0805', '0705', '0811', '0815', '0807', '0905', '0915'],
    AIRTEL: ['0802', '0808', '0701', '0708', '0812', '0901', '0902', '0907'],
    '9MOBILE': ['0809', '0817', '0818', '0908', '0909'],
  },
  'Sierra Leone': {
    AFRICELL: ['76', '77', '78', '88'],
    ORANGE: ['79', '25', '35', '55'],
    QCELL: ['30'],
    SIERRATEL: ['21', '22', '32', '52'],
  },
};
export const telcos = {
  Nigeria: [
    {
      name: 'MTN',
      airtimeId: 'BIL099',
      dataId: 'BIL108',
      image: require('../../assets/icons/mtn.png'), // local
    },
    {
      name: 'GLO',
      airtimeId: 'BIL102',
      dataId: 'BIL109',
      image: require('../../assets/icons/glo.png'),
    },
    {
      name: 'AIRTEL',
      airtimeId: 'BIL100',
      dataId: 'BIL110',
      image: require('../../assets/icons/airtel.png'), // local
    },
    {
      name: '9MOBILE',
      airtimeId: 'BIL103',
      dataId: 'BIL111',
      image: require('../../assets/icons/9mobile.jpeg'), // local
    },
  ],
  'Sierra Leone': [
    {
      name: 'Africell',
      airtimeId: 'SL_AFRICELL',
      dataId: 'SL_AFRICELL_DATA',
      image: {
        uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQMUymtLuvQA7iEkXRDunZ9b_WrIM4NUViE3Q&s',
      },
    },
    {
      name: 'Orange',
      airtimeId: 'SL_ORANGE',
      dataId: 'SL_ORANGE_DATA',
      image: {
        uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Orange_logo.svg/1200px-Orange_logo.svg.png',
      },
    },
    {
      name: 'QCell',
      airtimeId: 'SL_QCELL',
      dataId: 'SL_QCELL_DATA',
      image: {
        uri: 'https://www.gsma.com/get-involved/gsma-membership/wp-content/uploads/2014/06/qcell_logo.png',
      },
    },
    {
      name: 'Sierratel',
      airtimeId: 'SL_SIERRATEL',
      dataId: 'SL_SIERRATEL_DATA',
      image: {
        uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT4RkxrqKix6nUqHF7dXlb0M_q6hDaqGtwnkSSRbcBtFvFz4aSFUcHxUp_d6crSZxbfZrg&usqp=CAU',
      },
    },
  ],
};
export function detectNetwork(number, country) {
  const normalizedCountry =
    country?.trim().toLowerCase() === 'sierra leone'
      ? 'Sierra Leone'
      : 'Nigeria';

  const rules = prefixRules[normalizedCountry];
  if (!rules || !number) {
    return null;
  }

  const clean = number.replace(/\D/g, '').replace(/^234/, '0');
  if (clean.length < 4) {
    return null;
  }

  const prefixes = [
    clean.slice(0, 5),
    clean.slice(0, 4),
    clean.slice(0, 3),
    clean.slice(0, 2),
  ];

  for (const [network, nets] of Object.entries(rules)) {
    if (prefixes.some(pref => nets.includes(pref))) {
      return network.toUpperCase();
    }
  }

  return null;
}

export const getPerformanceStatus = (success, online) => {
  if (!online) {
    return {bg: 'bg-red-100', text: 'text-red-700', label: 'Offline'};
  }
  if (success >= 90) {
    return {bg: 'bg-green-100', text: 'text-green-700', label: 'Good'};
  } else if (success >= 70) {
    return {bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Average'};
  } else {
    return {bg: 'bg-red-100', text: 'text-red-700', label: 'Poor'};
  }
};
