import React from 'react';
import {View, Text, ScrollView, Image} from 'react-native';
import {styles} from "./style";
import {ScreenView} from "../../../global/wrappers";
import {WHITE} from '../../../global/theme';
import {CustomButton} from '../../../global/components';
// import { Header } from "../../../components/study";

const StatusReminder = (props) => {
  const navigation = props.navigation;

    return (
      <ScreenView style={styles.container} light color={WHITE}>
        <ScrollView
          style={styles.viewContainer}
        >
          <View style={styles.view1}>
              <Image
                style={styles.icon}
                source={require('../../../../assets/icons/smiley-up.png')}
              />

              <View
                style={styles.v11}
              >
                  <Text style={styles.text11}>A Gentle Reminder !!!</Text>
                  <Text style={styles.text12}>Every time you try to log in after logout out from your device you will get a one-time code to access your account.</Text>
              </View>

              <CustomButton
                  onPress={() => navigation.navigate('biometric-screen')}
                  style={styles.btn}
                  text={"Got it, Let’s go!"}
              />
          </View>
        </ScrollView>
      </ScreenView>
    );
};

export default StatusReminder;
