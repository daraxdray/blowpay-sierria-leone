import {Platform, StyleSheet} from 'react-native';
import {HEIGHT, MILK, WHITE, WIDTH} from '../../../../../global/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: HEIGHT,
    backgroundColor: MILK,
    width: WIDTH,
    alignSelf: 'center',
    alignItems: 'center',
  },
  viewContainer: {
    width: WIDTH,
    alignSelf: 'center',
    flex: 1,
  },
  view1: {
    width: '100%',
    paddingHorizontal: 20,
    marginTop: 40,
    flex: 1,
  },
  v2: {
    marginVertical: 20,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  containerOtp: {
    // padding: 10,
    // borderWidth: 1,
  },
  inputOtp: {
    padding: 15,
    marginHorizontal: 8,
    borderWidth: 1,
    borderRadius: 10,
  },
});
