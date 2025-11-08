import {StyleSheet} from 'react-native';
import {
  GREY,
  WHITE,
  SEMI_PRIMARY_COLOR,
  BLACK,
  HEIGHT,
} from '../../../global/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WHITE,
    height: HEIGHT,
  },
  viewContainer: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  btn: {
    padding: 10,
  },
  view1: {
    marginBottom: 20,
  },
  text1: {
    fontSize: 18,
    fontWeight: 'bold',
    color: BLACK,
    marginBottom: 10,
  },
  v2: {
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 15,
  },
  text: {
    fontSize: 13,
    color: BLACK,
    marginBottom: 5,
  },
  input: {
    height: 50,
    borderColor: '#D0D5DD',
    borderWidth: 1,
    color: BLACK,
    borderRadius: 10,
    paddingHorizontal: 10,
    backgroundColor: WHITE,
  },
  errorText: {
    color: 'red', // Red color for error messages
    fontSize: 12,
    marginTop: 5,
  },
  dateOfBirthLabel: {
    fontSize: 14,
    color: BLACK,
    marginBottom: 5,
  },
  dateOfBirthContainer: {
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  v21: {
    marginBottom: 20,
    paddingRight: 15,
  },
  rowView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: -10,
    marginBottom: 10,
  },
  icon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  text13: {
    fontSize: 13,

    color: BLACK,
  },
  underlineText: {
    textDecorationLine: 'underline',
    color: SEMI_PRIMARY_COLOR,
  },
  checkboxText: {
    marginLeft: 10,
    fontSize: 14,
    color: BLACK,
  },
  v3: {
    marginTop: 20,
  },
  btn1: {
    backgroundColor: SEMI_PRIMARY_COLOR,
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
  },
});
