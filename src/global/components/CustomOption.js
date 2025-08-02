import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {BLACK, BLACK2, GREY, WHITE} from '../theme';
import {open_sans, open_sans_bold} from '../../constants/data/fonts';


const CustomOption = ({item, value, setValue, onPress, disabled}) => {
    return (
        <TouchableOpacity style={styles.viewItem}
              onPress={onPress} disabled={disabled}
        >
            <Text style={styles.text1}>{item.value}</Text>

            <View style={[styles.selector, value.value === item.value ? {backgroundColor: PRIMARY_COLOR} : null ]}>
                <View style={[styles.dot]}/>
            </View>
        </TouchableOpacity>
    );
};

export default CustomOption;


const styles = StyleSheet.create({
    viewItem: {
        width: "100%",
        flexDirection: "row",
        marginBottom: 20,
        alignItems: "center",
        justifyContent: "space-between"
    },
    icon: {
        width: 12,
        height: 12,
    },
    iconContainer: {
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(169, 54, 145, 0.20)",
        width: 28,
        height: 28,
        borderRadius: 20,
        marginRight: 20
    },
    text1: {
        color: BLACK2,
        fontFamily: open_sans_bold,
        fontSize: 13
    },
    text2: {
        color: BLACK,
        fontSize: 12,
        fontFamily: open_sans,
        marginTop: 5
    },
    selector: {
        borderWidth: 0.8,
        borderColor: GREY,
        width: 20,
        height: 20,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 30,
        padding: 5
    },
    dot: {
        width: 7,
        height: 7,
        borderRadius: 20,
        backgroundColor: WHITE
    },
})
