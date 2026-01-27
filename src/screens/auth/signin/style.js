import {Platform, StyleSheet} from 'react-native';
import {
  BLACK,
  GREY_LIGHT2,
  HEIGHT,
  MILK,
  SECONDARY_COLOR,
  SEMI_PRIMARY_COLOR,
  WHITE,
  WIDTH,
} from '../../../global/theme';
import {
  open_sans_bold,
  satoshi,
  satoshi_bold,
  satoshi_medium,
} from '../../../constants/data/fonts';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: HEIGHT,
    backgroundColor: WHITE,
    width: WIDTH,
    alignSelf: 'center',
    alignItems: 'center',
  },
  viewContainer: {
    width: WIDTH * 0.95,
    alignSelf: 'center',
    flex: 1,
    paddingHorizontal: 20,
  },
  view1: {
    width: '100%',
    alignSelf: 'center',
    alignItems: 'center',
    marginTop: 20,
    flex: 1,
  },
  header: {
    width: '100%',
    marginTop: 15,
  },
  btn: {
    padding: 10,
    backgroundColor: GREY_LIGHT2,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50,
    width: 45,
    height: 45,
  },
  v1: {
    marginTop: 20,
    marginBottom: 7,
    width: '100%',
  },
  text1: {
    fontSize: 20,
    fontFamily: satoshi_bold,
    color: BLACK,
    marginBottom: 5,
  },
  text11: {
    fontSize: 12.5,
    fontFamily: satoshi_medium,
    color: '#A5A5A5',
    marginBottom: 5,
  },
  v2: {
    marginVertical: 20,
  },
  inputCont1: {},
  input1: {
    color: 'black',
  },
  v3: {
    width: '100%',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btn1: {
    marginVertical: 20,
  },
  text12: {
    fontSize: 12,
    color: SEMI_PRIMARY_COLOR,
    fontFamily: satoshi_bold,
  },
});
