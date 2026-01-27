import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {BLACK, GREY_LIGHT, PRIMARY_COLOR, WHITE} from '../theme';

const CustomToast = ({message, type}) => {
  return (
    <View
      style={[
        styles.toastContainer,
        type === 'error' ? styles.errorToast : styles.successToast,
      ]}>
      <Text style={styles.toastText}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  toastContainer: {
    position: 'absolute',
    top: 20,
    left: 0,
    right: 0,
    // transform: [{translateX: -50}],
    padding: 10,
    width: '100%',
    alignItems: 'center',
  },
  errorToast: {
    backgroundColor: PRIMARY_COLOR,
  },
  successToast: {
    backgroundColor: '#B2FFB2',
  },
  toastText: {
    color: WHITE,
    fontSize: 14,
  },
});

export default CustomToast;
