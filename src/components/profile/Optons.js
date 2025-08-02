import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import tw from 'twrnc';

const Options = ({icon, title, onPress, showIonicon = false}) => {
  return (
    <TouchableOpacity style={styles.list} onPress={onPress}>
      <View style={styles.listItem}>
        {icon}
        <Text
          style={[
            styles.listItemText,
            title === 'Logout' && styles.logoutText,
          ]}>
          {title}
        </Text>
      </View>
      {showIonicon && (
        <Ionicons name="chevron-forward" color="#000000" size={22} />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  list: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 18,
    marginTop: -8,
    borderTopColor: '#F2F4F7',
    borderTopWidth: 1, // Add this to make the border visible
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  listItemText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#344054',
    marginLeft: 20,
  },
  logoutText: {
    color: 'red',
  },
});

export default Options;
