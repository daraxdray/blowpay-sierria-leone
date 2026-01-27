import React, {useState} from 'react';
import {StyleSheet, Text, View, Button, TextInput, TouchableOpacity, Platform} from 'react-native';
import * as Animatable from "react-native-animatable";
import Ionicons from "react-native-vector-icons/Ionicons";
import {open_sans_bold, open_sans_medium, satoshi, satoshi_bold, satoshi_medium} from '../../constants/data/fonts';
import {BLACK, DARK_GREY, GREY_LIGHT, GREY_LIGHT2, PRIMARY_COLOR} from '../theme';

const CustomTextInput = ({
    onChangeText, ref, placeholder,
    value, onFocus, style, valid, inputStyle,autoComplete,
    props, keyboardType, setValue, phone,
    setCheck, less, other, email, title, list,
    sheetVal, setSheetVal, bottomSheetRef, sheetTitle,
    containerStyle, pass, noError, disabled, leftIcon
}) => {

    const [isValidValue, setIsValidValue] = useState({
        msg: `${title}` + ' is required!',
        check: valid,
    });

    const [isVisible, setIsVisible] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const handleValidate = (val) => {
        setValue(val);
        // console.log(value, " VR :: ", val);

        if (val.length <= 0) {
            setIsValidValue({
                msg: pass ? "Password" : title + ' is Empty',
                check: false,
            });
            setCheck(false);
        } else if (val.length < (pass ? 7 : less ? 1 : 3)) {
            setIsValidValue({
                msg: pass ? "Invalid Password" : 'Invalid ' + title,
                check: false,
            });
            setCheck(false);
        } else {
            setIsValidValue({
                ...isValidValue,
                check: true,
            });
            setCheck(true);
        }
    };
    const handleValidPhone = (val) => {
        setValue(val.trim());

        const regx2 =
            /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,9}$/im

        if (val.length <= 0) {
            setIsValidValue({
                msg: 'Phone Number Field is Empty',
                check: false,
            });
            setCheck(false);
        } else if (regx2.test(val)) {
            setIsValidValue({
                ...isValidValue,
                check: true,
            });
            setCheck(true);
        } else {
            setIsValidValue({
                msg: 'Invalid phone number',
                check: false,
            });
            setCheck(false);
        }
    }

    const handleValidEmail = (val) => {
        setValue(val.trim());

        const regx = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;


        if (val.length <= 0) {
            setIsValidValue({
                msg: 'Email Field is Empty',
                check: false,
            });
            setCheck(false);
        } else if (regx.test(val)) {
            setIsValidValue({
                ...isValidValue,
                check: true,
            });
            setCheck(true);
        } else {
            setIsValidValue({
                msg: 'Invalid email address',
                check: false,
            });
            setCheck(false);
        }
    };

    return (
        <View style={[{width: "100%", marginBottom: 8}, containerStyle]}>
            {title && !phone && <Text style={styles.text}>{title}</Text>}
            <TouchableOpacity
                style={[
                    {width: "100%", flexDirection: "row", alignItems: "center"},
                    bottomSheetRef ? {backgroundColor: GREY_LIGHT2, borderColor: "#D0D5DD", borderWidth: 1} : null,
                    inputStyle
                ]}
                disabled={disabled}
                onPress={() => {
                  if(bottomSheetRef) {
                      bottomSheetRef.current.focus();
                  }
                }}
            >
                <TextInput
                    ref={ref}
                    placeholder={placeholder}
                    autoCapitalize="none"
                    placeholderTextColor={'#ccc'}
                    value={value}
                    autoComplete={autoComplete}
                    onChangeText={(e) => onChangeText ? onChangeText(e) : email ?
                        handleValidEmail(e) : phone ? handleValidPhone(e) : handleValidate(e)}
                    onEndEditing={e => onChangeText ?
                        onChangeText(e.nativeEvent.text) : email ? handleValidEmail(e.nativeEvent.text) : phone ?
                            handleValidPhone(e.nativeEvent.text) : handleValidate(e.nativeEvent.text)}
                    // keyboardType={email ? "default" : phone ? "default" : keyboardType ? keyboardType : "default"}
                    keyboardType={email ? "default" : phone ? "phone-pad" : keyboardType ? keyboardType : "default"}
                    onFocus={() => {
                        setIsFocused(true);
                        onFocus && onFocus()
                    }}
                    onBlur={() => {
                        setIsFocused(false);
                    }}
                    selectionColor={'black'}
                    secureTextEntry={pass && !isVisible}
                    style={[
                        styles.input,
                        isFocused ? {borderWidth: 0.8, borderColor: PRIMARY_COLOR} :
                        style,
                    ]}
                    editable={!disabled}
                    {...props}
                />

                {pass ?
                    <TouchableOpacity
                    onPress={() => setIsVisible(prev => prev = !prev)}
                        style={{position: "absolute", right: 20, padding: 10, flexDirection: "row", alignItems: "center"}}
                    >
                        <View style={{width: 1, backgroundColor: isFocused ? PRIMARY_COLOR : BLACK, height: "160%", marginRight: 15}} />
                        <>
                            <Ionicons name={ isVisible ? "eye" : "eye-off"} color={DARK_GREY} size={15} style={{alignSelf: "center"}}/>
                        </>
                    </TouchableOpacity>
                    :
                leftIcon ?
                    <TouchableOpacity
                        style={{position: "absolute", right: 20, padding: 10, flexDirection: "row", alignItems: "center"}}
                        onPress={() => setIsVisible(prev => prev = !prev)}
                    >
                        <Ionicons name={leftIcon} color={DARK_GREY} size={15} style={{alignSelf: "center"}}/>
                    </TouchableOpacity>
                    :
                    null
                }
            </TouchableOpacity>

            {!isValidValue.check && !noError && (
                <Animatable.View animation="fadeInDown" duration={500}>
                    <Text
                        style={{
                            color: 'red',
                            fontSize: 12,
                            fontFamily: satoshi,
                        }}>
                        {isValidValue.msg}
                    </Text>
                </Animatable.View>
            )}
        </View>
    );

}

export default CustomTextInput;

const styles = StyleSheet.create({
    input: {
        width: "100%",
        borderRadius: 12,
        padding: Platform.OS =='android'? 10 : 18,
        borderWidth: 0.7,
        borderColor: '#ececec',
        fontSize: Platform.OS =='android'? 12: 15,
        color: 'black',
        fontFamily: satoshi_medium,
    },
    text: {
        fontSize: 13,
        fontFamily: satoshi_bold,
        marginVertical: 5,
        color: BLACK,
    }
})
