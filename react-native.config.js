module.exports = {
  dependencies: {
    'react-native-vector-icons': {
      platforms: {
        ios: null,
      },
    },
    'react-native-view-shot': {
      platforms: {
        android: null,
        ios: null,
      },
    },
  },
  project: {
    ios: {},
    android: {packageName: 'blowcloud.blowpay.org'},
  },
  assets: ['./node_modules/react-native-vector-icons/Fonts'],
};
