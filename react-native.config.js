module.exports = {
  dependencies: {
    'react-native-vector-icons': {
      platforms: {
        ios: null,
      },
    },
    'react-native-view-shot': {
      platforms: {
        android: {
          sourceDir: '../node_modules/react-native-view-shot/android',
        },
        ios: {},
      },
    },
  },
  project: {
    ios: {},
    android: {packageName: 'com.rdx.BillsByBlowmoney'},
  },
  assets: ['./node_modules/react-native-vector-icons/Fonts'],
};
