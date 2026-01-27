import React from 'react';
import {Image, View, StyleSheet, Text} from "react-native";
import {BLACK, SEMI_PRIMARY_COLOR, WIDTH} from '../../global/theme';
import {
    open_sans,
    open_sans_black,
    open_sans_bold,
    open_sans_semibold,
    satoshi,
    satoshi_medium,
} from '../../constants/data/fonts';


function Carouseltem({item, index}) {

    return (
        <View
            style={{width: "80%", height: "80%", alignItems: "center", justifyContent: "center", alignSelf: "center"}}
            key={index}
        >
            <Image source={item.icon} style={{width: "80%", height: "75%", marginTop: 20}} resizeMode={"contain"} />

            <View style={styles.v1}>
                <Text style={styles.text1}>{item.title}</Text>
                <Text style={styles.text2}>{item.content}</Text>
            </View>
        </View>
    );
}

export default Carouseltem;

const styles = StyleSheet.create({
    v1: {
        marginBottom: 20,
        marginTop: 8,
    },
    text1: {
        fontSize: 33,
        color: SEMI_PRIMARY_COLOR,
        justifyContent: "flex-start",
        textAlign: "left",
        textTransform: "capitalize",
        fontFamily: open_sans_bold,
        width: WIDTH * 0.68,
        marginBottom: 10
    },
    text2: {
        fontSize: 13,
        color: BLACK,
        textAlign: "left",
        fontFamily: satoshi_medium,
        lineHeight: 20,
    },
})
