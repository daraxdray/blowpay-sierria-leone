import {Platform, StyleSheet} from "react-native";
import {
    BLACK, GREY,
    GREY_LIGHT2,
    HEIGHT,
    MILK,
    SECONDARY_COLOR,
    SEMI_PRIMARY_COLOR,
    WHITE,
    WIDTH,
} from '../../../global/theme';
import {open_sans_bold, satoshi, satoshi_bold, satoshi_medium} from '../../../constants/data/fonts';

export const styles= StyleSheet.create({
    container: {
        flex: 1,
        height: HEIGHT,
        backgroundColor: WHITE,
        width: WIDTH,
        alignSelf: "center",
        alignItems: "center"
    },
    viewContainer: {
        width: WIDTH * 0.95,
        alignSelf: "center",
        height: HEIGHT,
        paddingHorizontal: 20,
    },
    view1: {
        width: "100%",
        alignSelf: "center",
        alignItems: "center",
        marginTop: 20,
        height: HEIGHT - 100,
    },
    header: {
        width: "100%",
        marginTop: 15,
    },
    btn: {
        padding: 10,
        backgroundColor: GREY_LIGHT2,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 50,
        width: 45,
        height: 45,
    },
    btn3: {
        padding: 10,
        backgroundColor: 'transparent',
        alignItems: 'center',
        justifyContent: 'center',
        color:'black',
        borderColor: 'red',
        borderWidth:1,
        width:'90%',
        height:45
    },
    v1: {
        marginTop: 20,
        marginBottom: 7,
        width: "100%",
    },
    text1: {
        fontSize: 20,
        fontFamily: satoshi_bold,
        color: BLACK,
        marginBottom: 5,
    },
    text11: {
        fontSize: 12.5,
        fontFamily: satoshi_medium,
        color: "#A5A5A5",
        marginBottom: 5,
    },
    v2: {
        flexGrow: 1,
        marginVertical: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    v21: {
        marginVertical: 10,
    },
    rowView: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 7,
    },
    text13: {
        fontSize: 12,
        fontFamily: satoshi_medium,
        color: GREY,
        marginBottom: 5,
    },
    icon: {
        width: 15,
        height: 15,
        marginRight: 10,
        marginTop: -5
    },
    inputCont1: {

    },
    input1: {

    },
    v3: {
        width: "100%",
        alignSelf: "center",
        alignItems: "center",
        justifyContent: "center",
    },
    btn1: {
        marginVertical: 20,
        width: "90%",
    },
    text12: {
        fontSize: 12,
        color: SEMI_PRIMARY_COLOR,
        fontFamily: satoshi_bold,
    },
    image: {
        width: WIDTH * 0.65,
        height: WIDTH * 0.65,
        // marginVertical: "10%"
    }
});
