import React from "react";
import {Text, TouchableOpacity, StyleSheet, Platform, Image} from "react-native";
import {CircleSnail} from "react-native-progress"
import {
    open_sans,
    open_sans_bold,
    open_sans_medium,
    open_sans_semibold,
    satoshi_bold,
} from '../../constants/data/fonts';
import {BLACK, GREY_LIGHT, PRIMARY_COLOR, WHITE} from '../theme';


const CustomButton = ({style, text, textStyle, onPress, loading, checker = true, light, icon, dark}) => {
    return(
        <TouchableOpacity
            style={[
                styles.container,
                
                checker === false ? {backgroundColor: "#aaa"} :
                light ? styles.lightContainer :
                dark ? styles.darkContainer : null,
                style,
            ]}
            activeOpacity={0.65}
            onPress={onPress}
            disabled={loading || !checker}
        >
            {
                loading ?
                    <CircleSnail
                        color={["white", "black"]}
                        size={22}
                    />
                    :
                    <>
                        {icon && <Image style={styles.icon} source={icon} resizeMode={"contain"}/>}
                        <Text
                            style={[
                                styles.text, textStyle,
                                light ? {color: BLACK} :
                                dark ? {color: WHITE} : null
                            ]}
                        >{text ? text : "Continue"}</Text>
                    </>
            }
        </TouchableOpacity>
    )
};

export default CustomButton;

const styles = StyleSheet.create({
    container: {
        width: Platform.OS === "ios" ? "90%" : "100%",
        backgroundColor: PRIMARY_COLOR,
        padding: 15,
        borderRadius: 8,
        alignItems: "center",
        alignSelf: "center",
        justifyContent: "center",
        flexDirection: "row",
    },
    icon: {
        width: 16,
        height: 16,
        marginRight: 10,
    },
    text: {
        color: "#fff",
        fontSize: 11.5,
        fontFamily: satoshi_bold,
    },
    lightContainer: {
        backgroundColor: GREY_LIGHT,
        borderColor: PRIMARY_COLOR,
        // borderWidth: 1
    },
    darkContainer: {
        backgroundColor: BLACK,
        borderColor: "#5F5F63",
        borderWidth: 1,
    }
});
