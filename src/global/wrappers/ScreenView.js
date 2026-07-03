import React from 'react';
import {StatusBar, StyleSheet} from "react-native";
import {SafeAreaView} from 'react-native-safe-area-context';
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
    },
});

export default ScreenView;
