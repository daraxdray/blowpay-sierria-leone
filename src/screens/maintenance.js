import React, { useEffect, useRef, useState } from 'react';
import { View, Text, ScrollView, StatusBar, StyleSheet } from 'react-native';

import { ScreenView } from '../global/wrappers';
import LinearGradient from 'react-native-linear-gradient';

import { CustomButton } from '../global/components';
import { useSelector } from 'react-redux';
import { CommonActions } from '@react-navigation/native';
import { BLACK, SEMI_PRIMARY_COLOR, WHITE, WIDTH } from '../global/theme';
import { styles } from './onboard/walkthrough/style';
import { Image } from 'react-native-animatable';
import { open_sans_bold, satoshi_medium } from '../constants/data/fonts';

const MaintenanceScreen = props => {
  const navigation = props.navigation;
  const { isAuthenticated, } = useSelector((state) => state.user);
  const carouselRef = useRef(null);

  // States
  const [index, setIndex] = useState(0);

  const _constructor = () => {
    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor(WHITE);
      StatusBar.setBarStyle('light-content');
    }
  };

  const gotoDashboard = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{name: 'bottom-tab'}],
      }),
    );  
  }
  useEffect(() => {
    return () => {
      _constructor();
    };
  }, []);

  return (
    <ScreenView style={styles.container} dark color={'#FFB1C4'}>
      <LinearGradient
        colors={['#FFB1C4', '#FCE1E8', '#fcfcfc']}
        // start={{x: 0, y: 0}} end={{x: 0, y: 1}}
        style={styles.linearGradient}>
        <ScrollView
          contentContainerStyle={styles.viewContainer}
        >
          <View style={styles.view1}>
            <View style={styles.carouselContainer}>
              <View
                style={{ width: "80%", height: "80%", alignItems: "center", justifyContent: "center", alignSelf: "center" }}
                
              >
                <Image source={require('../../assets/images/monthly.png')} style={{ width: "80%", height: "75%", marginTop: 20 }} resizeMode={"contain"} />

                <View style={inStyles.v1}>
                  <Text style={inStyles.text1}>Maintenance Mode</Text>
                  <Text style={inStyles.text2}>We are working on something...</Text>
                </View>
              </View>
            </View>

            <View style={styles.v12}>
             <CustomButton
                    text={'Reload'}
                    onPress={gotoDashboard}
                    style={{ width: '80%', borderRadius: 20, marginRight: 20 }}
                  />
               
              
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </ScreenView>
  );
};

const inStyles = StyleSheet.create({
  v1: {
      marginBottom: 20,
      marginTop: 8,
  },
  text1: {
      fontSize: 33,
      color: SEMI_PRIMARY_COLOR,
      justifyContent: "flex-start",
      textAlign: "left",
      textTransform: "capitalize",
      fontFamily: open_sans_bold,
      width: WIDTH * 0.68,
      marginBottom: 10
  },
  text2: {
      fontSize: 13,
      color: BLACK,
      textAlign: "left",
      fontFamily: satoshi_medium,
      lineHeight: 20,
  },
})

export default MaintenanceScreen;
