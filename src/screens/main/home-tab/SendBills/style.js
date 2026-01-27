import {Platform, StyleSheet} from 'react-native';
import {
  HEIGHT,
  MILK,
  WHITE,
  WIDTH,
  GREY_LIGHT2,
} from '../../../../global/theme'; // Ensure GREY_LIGHT2 is imported

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
    paddingHorizontal: 10,
    // justifyContent: 'space-between',
  },
  view1: {
    width: '100%',
    paddingHorizontal: 20,
    marginTop: 10,
    flex: 1,
  },
  header: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  imageContainer: {
    position: 'absolute',
    right: 10, // Adjust to position the image inside the TextInput
    top: '40%',
    transform: [{translateY: -10}], // Center the image vertically
    zIndex: 1,
    backgroundColor: '#F3F4F6',
    padding: 5,
    borderRadius: 5,
  },
  image: {
    width: 20, // Adjust width as needed
    height: 20, // Adjust height as needed
  },
});
