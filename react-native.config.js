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
    android: {packageName: 'com.blowcloud.blowpay'},
  },
  assets: ['./node_modules/react-native-vector-icons/Fonts'],
};
