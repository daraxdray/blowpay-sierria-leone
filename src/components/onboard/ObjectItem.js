import {Image, Text, View} from "react-native";
import {styles} from "../../screens/onboard/walkthrough/style";

const ObjectItem = ({text, icon}) => {
    return (
        <View style={styles.rowViewN}>
            <Image
                source={icon}
                style={styles.icon}
            />
            <Text style={styles.text2}>{text}</Text>
        </View>
    );
};

export default ObjectItem;
