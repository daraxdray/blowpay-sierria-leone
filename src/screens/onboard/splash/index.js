import React, {useEffect, useState} from 'react';
import {View, Text, ScrollView, Image} from 'react-native';
import {styles} from "./style";
import {ScreenView} from "../../../global/wrappers";
import {MILK} from '../../../global/theme';
import * as Animatable from 'react-native-animatable';


const SplashScreen = (props) => {
  const navigation = props.navigation;

  // states
  const [back, setBack] = useState(false);
  const delay = 0;


  const _constructor = () => {
      navigation.replace('walkthrough-screen');
  }

    useEffect(() => {
        setTimeout(() => {
            _constructor();
        }, 2500)
    }, []);


    return (
      <ScreenView style={styles.container} light color={MILK}>
        <ScrollView
          contentContainerStyle={styles.viewContainer}
        >
          <View style={styles.view1}>
              <Animatable.Image
                // animation={{
                //   from: {
                //       rotateX: back ? '0deg' : '180deg',
                //       rotate: !back ? '180deg' : '0deg',
                //   },
                //   to: {
                //       rotateX: back ? '360deg' : '-180deg',
                //       rotate: !back ? '180deg' : '0deg',
                //   },
                // }}
                duration={1500}
                delay={delay}
                easing="linear"
                // iterationCount="infinite"
                useNativeDriver
                source={require('../../../../assets/icons/icon.png')}
                style={styles.logo}
                resizeMode={"contain"}
              />
          </View>
        </ScrollView>
      </ScreenView>
    );
};

export default SplashScreen;
