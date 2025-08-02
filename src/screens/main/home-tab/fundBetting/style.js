import {Platform, StyleSheet} from 'react-native';
import { HEIGHT, MILK, WHITE, WIDTH} from '../../../../global/theme';

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
    alignSelf: 'center',
    alignItems: 'center',
    marginTop: 20,
    flex: 1,
    paddingHorizontal: 15,
  },
  imageContainer: {
    position: 'absolute',
    right: 10,
    top: '40%',
    transform: [{translateY: -10}],
    zIndex: 1,
    padding: 5,
    borderRadius: 5,
  },
  image: {
    width: 20,
    height: 20,
  },
});
