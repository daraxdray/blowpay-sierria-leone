import {Platform, StyleSheet} from "react-native";
import { HEIGHT, MILK, WHITE, WIDTH } from "../../../global/theme";

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
        width: "100%",
        alignSelf: "center",
        height: HEIGHT,
    },
    view1: {
        width: "100%",
        alignSelf: "center",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 20,
        flex: 1
    },
    logo: {
        width: WIDTH * 0.25,
        height: WIDTH * 0.25,
        backfaceVisibility: 'hidden',
    }
});
