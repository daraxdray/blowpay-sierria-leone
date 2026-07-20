import React, {useContext} from "react";
import {Text, TouchableOpacity, View} from "react-native";
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {satoshi_bold, satoshi_medium} from '../../constants/data/fonts';
import {GREY, PRIMARY_COLOR, WHITE} from '../../global/theme';



const CustomTab = ({ state, descriptors, navigation }) => {
    const insets = useSafeAreaInsets();

    return (
        <View style={{ flexDirection: 'row', paddingHorizontal: 20, backgroundColor: WHITE, paddingBottom: Math.max(insets.bottom, 8) }}>
            {/*<ImageBackground*/}
            {/*    source={require('../../../assets/images/bottom_tab.png')}  // Replace with your image path*/}
            {/*    style={{ flexDirection: 'row', paddingHorizontal: 20, width: "100%" }}*/}
            {/*    resizeMode="cover" // Optional, set how the image is resized*/}
            {/*>*/}
            {state.routes.map((route, index) => {
                const { options } = descriptors[route.key];
                const label =
                    options.tabBarLabel !== undefined
                        ? options.tabBarLabel
                        : options.title !== undefined
                            ? options.title
                            : route.name;

                const Icon = options.tabBarIcon.default;
                const IconOnline = options.onlineIcon.default;
                console.log({IconOnline})

                const isFocused = state.index === index;

                const onPress = () => {
                    // console.log(`name: ${route.name}`)
                    const event = navigation.emit({
                        type: 'tabPress',
                        target: route.key,
                        canPreventDefault: true,
                    });

                    if (!isFocused && !event.defaultPrevented) {
                        // The `merge: true` option makes sure that the params inside the tab screen are preserved
                        navigation.navigate({ name: route.name, merge: true });
                        // if(route.name === "InsightTab") {
                        //     StatusBar.setBarStyle("light-content");
                        // } else {
                        //     StatusBar.setBarStyle("dark-content");
                        // }
                    }
                };

                const onLongPress = () => {
                    navigation.emit({
                        type: 'tabLongPress',
                        target: route.key,
                    });
                };

                return (
                    <TouchableOpacity
                        key={index}
                        accessibilityRole="button"
                        accessibilityState={isFocused ? { selected: true } : {}}
                        accessibilityLabel={options.tabBarAccessibilityLabel}
                        testID={options.tabBarTestID}
                        onPress={onPress}
                        activeOpacity={0.77}
                        style={{ flex: 1, alignItems: "center", backgroundColor: WHITE, paddingVertical: 18 }}
                    >
                        {
                            isFocused ?
                                <IconOnline width={20} height={20} />
                                :
                                <Icon width={20} height={20} />
                        }
                        <Text style={{
                            color: isFocused ? PRIMARY_COLOR : GREY, fontSize: isFocused ? 12.5 : 11.5,
                            fontFamily: isFocused ? satoshi_bold : satoshi_medium,
                        }}>
                            {label}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    )
}

export default CustomTab;
