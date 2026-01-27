import {Platform, StyleSheet} from "react-native";
import {BLACK, BLACK2, GREY, HEIGHT, MILK, SEMI_PRIMARY_COLOR, WHITE, WIDTH} from '../../../global/theme';
import {satoshi, satoshi_bold, satoshi_medium} from '../../../constants/data/fonts';

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
        width: WIDTH,
        height: HEIGHT,
        alignSelf: "center",
    },
    view1: {
        width: "90%",
        alignSelf: "center",
        alignItems: "center",
        marginTop: "15%",
        flex: 1
    },
    icon: {
        width: 70,
        height: 70,
        marginVertical: 35
    },
    v11: {
        width: "100%",
        alignItems: 'center',
        justifyContent: "center",
        marginVertical: 10,
    },
    text11: {
        fontSize: 18,
        color: BLACK,
        fontFamily: satoshi_bold,
    },
    text12: {
        fontSize: 12,
        color: BLACK2,
        fontFamily: satoshi,
        textAlign: "center",
        marginVertical: 20,
        width: "80%",
        lineHeight: 18
    },
    btn: {
        width: "90%",
        marginTop: "10%",
    }
});
