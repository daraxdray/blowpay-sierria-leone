import React, { useEffect, useRef, useState } from 'react';
import { View, Text, ScrollView, StatusBar } from 'react-native';
import { styles } from './style';
import { ScreenView } from '../../../global/wrappers';
import LinearGradient from 'react-native-linear-gradient';
import {
  GREY,
  GREY2,
  HEIGHT,
  MILK,
  PRIMARY_COLOR,
  SECONDARY_COLOR,
  SEMI_PRIMARY_COLOR,
  WHITE,
  WIDTH,
} from '../../../global/theme';
import Carousel from 'react-native-reanimated-carousel';
import { Carouseltem } from '../../../components/onboard';
import { CarouselData } from '../../../constants/onboard';
import { CustomButton } from '../../../global/components';
import { useSelector } from 'react-redux';
import { CommonActions } from '@react-navigation/native';
import { useGetUser } from '../../../hooks/user.hook';
// import AsyncStorage from '@react-native-async-storage/async-storage';

const Walkthrough = props => {
  const navigation = props.navigation;
  const { isAuthenticated,  } = useSelector((state) => state.user);
  const carouselRef = useRef(null);
  const { data: user, status: fetchingUser } = useGetUser();

  // States
  const [index, setIndex] = useState(0);

  const _constructor = () => {
    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor(WHITE);
      StatusBar.setBarStyle('light-content');
    }
  };

  const gotoDashboard = ()=>{

    if(user?.message == "Unauthorized" || user?.data == undefined){
      navigation.navigate('TransactionPinScreen',{params:{"currentRoute":"walkthrough-screen"}})
    }else{
      navigation.dispatch(
          CommonActions.reset({
              index: 0,
              routes: [{name: 'bottom-tab'}],
            }),
          );  
        }
  }
  useEffect(() => {
    return () => {
      _constructor();
    };
  }, []);

  // useEffect(()=>{
  //    checkLogin = async ()=>{
  //     const isLoggedIn =  AsyncStorage.getItem('Login');
  //   }
  // },[])

  return (
    <ScreenView style={styles.container} dark color={'#FFB1C4'}>
      <LinearGradient
        colors={['#FFB1C4', '#FCE1E8', '#fcfcfc']}
        // start={{x: 0, y: 0}} end={{x: 0, y: 1}}
        style={styles.linearGradient}>
        <ScrollView
        // contentContainerStyle={styles.viewContainer}
        >
          <View style={styles.view1}>
            <View style={styles.carouselContainer}>
             
              <Carousel
                ref={carouselRef}
                loop
                width={WIDTH}
                height={HEIGHT * 0.3}
                autoPlay={false}
                data={CarouselData}
                scrollAnimationDuration={1000}
                onSnapToItem={(index) => setIndex(index)}
                renderItem={({ item, index }) => (
                  <Carouseltem key={item.id} item={item} index={index} />
                )}
                mode="parallax"
                modeConfig={{
                  parallaxScrollingScale: 0.9,
                  parallaxScrollingOffset: 50,
                }}
                
                
              />

              {/* <Pagination
                dotsLength={CarouselData.length}
                activeDotIndex={index}
                carouselRef={carouselRef}
                dotStyle={{
                  width: 40,
                  height: 8,
                  borderRadius: 5,
                  marginHorizontal: -8,
                  backgroundColor: SEMI_PRIMARY_COLOR,
                }}
                inactiveDotOpacity={0.4}
                inactiveDotScale={0.6}
                inactiveDotStyle={{
                  width: 12,
                  height: 12,
                  borderRadius: 50,
                  marginHorizontal: -10,
                  backgroundColor: GREY2,
                }}
                tappableDots={true}
                // containerStyle={{ marginBottom: 10 }}
              /> */}
            </View>

            <View style={styles.v12}>
              {!isAuthenticated ?
                <>
                  <CustomButton
                    text={'Sign in'}
                    light
                    onPress={() => navigation.navigate('signin-screen')}
                    style={{ width: '38%', borderRadius: 20 }}
                  />

                  <CustomButton
                    text={'Create an Account'}
                    // onPress={() => navigation.navigate('signup-screen')}
                    onPress={() => navigation.navigate('register-info-screen')}
                    style={{ width: '38%', borderRadius: 20, marginRight: 20 }}
                  /></> :
                  <>
                
                  <CustomButton
                    text={'Goto Dashboard'}
                    onPress={gotoDashboard}
                    style={{ width: '80%', borderRadius: 20, marginRight: 20 }}
                  />
                  </>
              }
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </ScreenView>
  );
};

export default Walkthrough;
