import React from 'react';
import LottieView from 'lottie-react-native';

export default function BiometricScan() {
  return (
    <LottieView source={require('files/scanner.json')} autoPlay loop />
  );
}



