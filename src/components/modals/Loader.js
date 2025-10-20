import React, {useEffect, useRef} from 'react';
import {View, StyleSheet, Animated, Easing} from 'react-native';
import Appicon from '../../../assets/svgs/BLOWPAYLOGO.svg'; // make sure this exists

const Loader = () => {
  const blowAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(blowAnim, {
          toValue: 1.5,
          duration: 800,
          easing: Easing.bounce,
          useNativeDriver: true,
        }),
        Animated.timing(blowAnim, {
          toValue: 1,
          duration: 800,
          easing: Easing.bounce,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [blowAnim]);

  return (
    <View style={styles.container}>
      <Animated.View style={{transform: [{scale: blowAnim}]}}>
        <Appicon width={120} height={120} />
      </Animated.View>
    </View>
  );
};

export default Loader;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    zIndex: 1000,
  },
});
