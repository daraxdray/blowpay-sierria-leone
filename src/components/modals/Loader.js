import React from 'react';
import {View, StyleSheet, Animated, Easing, Platform} from 'react-native';
import {useEffect, useRef} from 'react';
import Appicon from '../../../assets/svgs/logo_ios.svg';
import Appicon2 from '../../../assets/svgs/logo.svg';
import appConstant from '../../constants/data/appConstant';

const Loader = () => {
  const blowAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(blowAnim, {
          toValue: 1.5, // Scale up for "blow" effect
          duration: 800,
          easing: Easing.bounce,
          useNativeDriver: true,
        }),
        Animated.timing(blowAnim, {
          toValue: 1, // Scale back to original size
          duration: 800,
          easing: Easing.bounce,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [blowAnim]);

  return (
    <View style={styles.container}>
      <Animated.View style={{transform: [{scale: blowAnim}],}}>
        {/* {Platform.OS == 'ios' || appConstant.isAmazonStore ? <SvgUri uri={Appicon} /> : <SvgUri uri={Appicon2} />} */}
      </Animated.View>
    </View>
  );

};

export default Loader;
const styles = StyleSheet.create({
  container: {
    position: 'absolute', // This ensures the loader is positioned absolutely
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255,0.6)', // Semi-transparent background to indicate loading
    zIndex: 1000, // / High zIndex to ensure it stays on top
  },
});
