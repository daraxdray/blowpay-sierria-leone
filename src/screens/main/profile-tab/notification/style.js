import {StyleSheet} from 'react-native';
import {HEIGHT, WHITE, WIDTH} from '../../../../global/theme';

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
    marginTop: 10,
    flex: 1,
    gap: 20,
  },
});
