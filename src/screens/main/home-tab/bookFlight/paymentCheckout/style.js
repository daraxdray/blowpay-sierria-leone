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
    marginTop: 10,
    flex: 1,
    display: 'flex',
    gap: 20,
  },
});
