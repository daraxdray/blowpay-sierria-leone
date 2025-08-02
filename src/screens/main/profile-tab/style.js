import {Platform, StyleSheet} from 'react-native';
import {HEIGHT, MILK, WHITE, WIDTH} from '../../../global/theme';

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
    // alignSelf: 'center',
    flex: 1,
  },
  view1: {
    width: '100%',
    alignSelf: 'center',
    alignItems: 'center',
    flex: 1,
    paddingHorizontal: 20,
  },
  backgroundContainer: {
    ...StyleSheet.absoluteFillObject, // Fill the entire container
    zIndex: -1, // Ensure the background stays behind the content
  },
  svgBackground: {
    width: '100%', // Make the SVG cover the entire width
    height: '100%', // Make the SVG cover the entire height
  },
  infoTxt: {
    color:'#000'
  },
  input: {
    height: 50,
    borderColor: '#D0D5DD',
    borderWidth: 1,
    color: 'black',
    borderRadius: 10,
    paddingHorizontal: 10,
    backgroundColor: WHITE,
  },
  
});
