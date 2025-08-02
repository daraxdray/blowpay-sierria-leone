import React from 'react';
import {View, Text, ScrollView} from 'react-native';
import {styles} from './style';
import {ScreenView} from '../../../global/wrappers';
import {WHITE} from '../../../global/theme';
// import { Header } from "../../../components/study";

const TransferTab = props => {
  const navigation = props.navigation;

  return (
    <ScreenView style={styles.container} light color={WHITE}>
      <ScrollView style={styles.viewContainer}>
        {/*<Header*/}
        {/*  navigation={navigation}*/}
        {/*  title={"TransferTab"}*/}
        {/*  style={{width: "90%", alignSelf: "center"}}*/}
        {/*/>*/}

        <View style={styles.view1}></View>
      </ScrollView>
    </ScreenView>
  );
};

export default TransferTab;
