import React, {useMemo, useState} from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {BottomSheetModal, BottomSheetScrollView} from '@gorhom/bottom-sheet';
import {
  BLACK,
  BLACK2,
  DARK_GREY,
  GREY,
  GREY2,
  GREY_BG,
  PRIMARY_COLOR,
  SECONDARY_COLOR,
  WHITE,
} from '../../constants/theme';
import {gilroy, gilroy_bold, gilroy_semi_bold} from '../../constants';

const Selector = ({
  bottomSheetRef,
  handleSheetChanges,
  list,
  value,
  setValue,
  title,
  size,
  fullObject,
  onPress,
}) => {
  const snapPoints = useMemo(
    () => [size == 'med' ? '30%' : '10%', size == 'med' ? '55%' : '45%'],
    [],
  );

  const [type, setType] = useState(null);

  const _setFilter = value => {
    if (fullObject) {
      setValue(value);
    } else {
      setValue(value.value);
    }

    bottomSheetRef.current.close();
  };

  return (
    <BottomSheetModal
      ref={bottomSheetRef}
      index={1}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}
      enablePanDownToClose={true}
      containerStyle={{
        borderTopRightRadius: 22,
        borderTopLeftRadius: 22,
        backgroundColor: 'rgba(61, 59, 59, 0.35)',
      }}>
      <View style={styles.container}>
        {title && (
          <>
            <Text style={styles.headerText}>{title}</Text>
            <View style={styles.line} />
          </>
        )}

        <ScrollView>
          <View style={styles.v1}>
            {list.map((item, index) => (
              <TouchableOpacity
                style={styles.viewItem}
                key={index}
                onPress={() => (onPress ? setValue(item) : _setFilter(item))}>
                <Text style={styles.text1}>{item.name}</Text>

                <View
                  style={[
                    styles.selector,
                    (fullObject ? value.value : value) === item.value
                      ? {backgroundColor: PRIMARY_COLOR}
                      : null,
                  ]}>
                  <View style={[styles.dot]} />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>
    </BottomSheetModal>
  );
};

export default Selector;

const styles = StyleSheet.create({
  container: {
    backgroundColor: WHITE,
    width: '100%',
    padding: 20,
  },
  headerText: {
    color: BLACK,
    fontFamily: gilroy_bold,
    fontSize: 15,
  },
  line: {
    width: '100%',
    height: 0.8,
    backgroundColor: GREY,
    marginTop: 5,
  },
  v1: {
    marginTop: 20,
    padding: 10,
    // flex: 1,
    // width: "100%",
  },
  viewItem: {
    width: '100%',
    flexDirection: 'row',
    marginBottom: 33,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  icon: {
    width: 12,
    height: 12,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(169, 54, 145, 0.20)',
    width: 28,
    height: 28,
    borderRadius: 20,
    marginRight: 20,
  },
  text1: {
    color: BLACK2,
    fontFamily: gilroy_semi_bold,
    fontSize: 13,
  },
  text2: {
    color: BLACK,
    fontSize: 12,
    fontFamily: gilroy,
    marginTop: 5,
  },
  selector: {
    borderWidth: 0.8,
    borderColor: GREY,
    width: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
    padding: 5,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 20,
    backgroundColor: WHITE,
  },
});
