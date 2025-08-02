import {Platform, StyleSheet} from 'react-native';
import {BLACK, HEIGHT, MILK, WHITE, WIDTH} from '../../../global/theme';
import {
  satoshi,
  satoshi_black,
  satoshi_bold,
} from '../../../constants/data/fonts';

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
    width: WIDTH,
    paddingHorizontal: 12,
    marginTop: 10,
    flex: 1,
  },
  view2: {
    display: 'flex',
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  view3: {
    display: 'flex',
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  text1: {
    fontSize: 14,
    fontWeight: '300',
    color: '#344054',
  },
  text2: {
    fontSize: 14,
    fontWeight: '700',
    color: BLACK,
    // fontFamily: satoshi_black
  },
  text3: {
    color: 'white',
    fontSize: 12,
  },
  profile: {
    backgroundColor: '#E5E5E6',
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
    borderRadius: 30,
  },
  notify: {
    position: 'relative',
    // height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    // width: 50,
    // borderRadius: 30,
  },
  number: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: 'red',
    height: 15,
    width: 15,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },

  
});
