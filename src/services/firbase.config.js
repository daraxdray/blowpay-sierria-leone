import {firebase} from '@react-native-firebase/app';
const firebaseConfig = {
  apiKey: 'AIzaSyAEoSBfL93bFcGOuCTDiwJxWYHyPfNeX3s',
  authDomain: 'blowpay-274a8.firebaseapp.com',
  projectId: 'blowpay-274a8',
  storageBucket: 'blowpay-274a8.appspot.com',
  messagingSenderId: '385372762056',
  appId: '1:385372762056:android:cc1c46f1e3701bb25c5afd',
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export default firebase;
