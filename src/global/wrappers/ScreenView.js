import React from 'react';
import {Platform, SafeAreaView, StatusBar, StyleSheet} from "react-native";
import {MILK, WIDTH} from '../theme';

const ScreenView = ({style, children, dark, light, color}) => {
    return (
        <SafeAreaView style={[styles.container, style]}>
            {(dark || light) &&
                <StatusBar barStyle={!dark ? "dark-content" : "light-content"} backgroundColor={color ? color : dark ? "#fff": "#aaa"}/>
            }
            {children}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: MILK,
        width: WIDTH,
        // paddingTop: Platform.OS === "android" ? 20 : 0,
    },
});

export default ScreenView;
