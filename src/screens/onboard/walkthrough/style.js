import {Platform, StyleSheet} from "react-native";
import {HEIGHT, MILK, PRIMARY_COLOR, WIDTH} from '../../../global/theme';

export const styles= StyleSheet.create({
    container: {
        flex: 1,
        height: HEIGHT,
        backgroundColor: MILK,
        width: WIDTH,
        alignSelf: "center",
        alignItems: "center"
    },
    viewContainer: {
        // width: "100%",
        alignSelf: "center",
        height: HEIGHT,
    },
    linearGradient: {
        flex: 1,
    },
    view1: {
        alignSelf: "center",
        justifyContent: "center",
        alignItems: "center",
        height: HEIGHT,
        
    },
    carouselContainer: {
        // width: "100%",
        
    },
    view11: {
        width: "90%",
        alignSelf: "center",
        flex: 1,
        marginBottom: 100,
    },
    text1: {
        // fontFamily: dmsans_bold,
        fontSize: 13,
        color: PRIMARY_COLOR,
        alignSelf: "center",
        textAlign: "center"
    },
    v12: {
        width: "100%",
        flexDirection: 'row',
        alignSelf: "center",
        alignItems: "center",
        justifyContent: "space-evenly",
    }
});
