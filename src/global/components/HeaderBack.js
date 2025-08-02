import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from "react-native";

import Back from "../../../assets/svg/icons/back-arrow-black.svg";
import {PRIMARY_COLOR} from '../theme';
import {open_sans_semibold} from '../../constants/data/fonts';

const HeaderBack = ({navigation, onLeftPress}) => {
    return (
        <View style={styles.container}>
            <TouchableOpacity
                onPress={() => navigation.goBack()}
            >
                <Back width={16} height={16} />
            </TouchableOpacity>

            {
                onLeftPress &&
                    <TouchableOpacity
                        onPress={onLeftPress}
                        style={{
                            paddingVertical: 8, paddingHorizontal: 20, alignItems: "center", justifyContent: "center",
                            borderWidth: 1, borderRadius: 10, borderColor: PRIMARY_COLOR
                        }}
                    >
                        <Text style={styles.text1}>Clear</Text>
                    </TouchableOpacity>
            }
        </View>
    );
};

export default HeaderBack;

const styles = StyleSheet.create({
    container: {
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    },
    text1: {
        fontSize: 12,
        fontFamily: open_sans_semibold,
    }
})
