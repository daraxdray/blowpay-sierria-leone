import {StyleSheet} from 'react-native';
import {
  BLACK,
  GREY_LIGHT2,
  HEIGHT,
  PRIMARY_COLOR,
  WHITE,
  WIDTH,
} from '../../../global/theme';
import {satoshi_bold, satoshi_medium} from '../../../constants/data/fonts';

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
  scrollContent: {
    flexGrow: 1,
  },
  view1: {
    width: '100%',
    alignSelf: 'center',
    alignItems: 'center',
    marginTop: 20,
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
    marginBottom: 25,
    width: '100%',
  },
  text1: {
    fontSize: 18,
    fontFamily: satoshi_bold,
    color: BLACK,
    marginBottom: 6,
    letterSpacing: -0.3,
  },
  text11: {
    fontSize: 12.5,
    fontFamily: satoshi_medium,
    color: '#A5A5A5',
    lineHeight: 18,
    letterSpacing: -0.1,
  },
  countriesContainer: {
    width: '100%',
    marginTop: 10,
  },
  countryCard: {
    width: '100%',
    backgroundColor: '#FAFAFA',
    borderRadius: 14,
    padding: 18,
    marginBottom: 12,
    borderWidth: 1.5,
    borderColor: '#F0F0F0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  countryCardSelected: {
    borderColor: PRIMARY_COLOR,
    backgroundColor: WHITE,
    borderWidth: 1.5,
  },
  countryCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  flagContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: WHITE,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
    borderWidth: 1,
    borderColor: '#F5F5F5',
  },
  flagEmoji: {
    fontSize: 24,
  },
  countryInfo: {
    flex: 1,
  },
  countryName: {
    fontSize: 14.5,
    fontFamily: satoshi_bold,
    color: BLACK,
    marginBottom: 3,
    letterSpacing: -0.2,
  },
  countryDetails: {
    fontSize: 11.5,
    fontFamily: satoshi_medium,
    color: '#9E9E9E',
    letterSpacing: -0.1,
  },
  checkmark: {
    marginLeft: 10,
  },
  buttonContainer: {
    width: WIDTH * 0.95,
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: WHITE,
  },
  continueBtn: {
    width: '100%',
    marginBottom: 20,
  },
});
