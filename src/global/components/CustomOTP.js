import React, {useRef, useState, useEffect} from "react";
import {View, TextInput, StyleSheet, Text} from "react-native";
import {WIDTH} from "../styles";
import { _errorPrompt } from "../../utils";
import {GREY, PRIMARY_COLOR} from '../theme';
import {open_sans_bold, open_sans_light, open_sans_semibold} from '../../constants/data/fonts';


const CustomOTP = ({setOtp, otp, viewStyle, inputStyle}) => {

    // useEffect(() => {
    //     // setOtp([one, two, three, four]);
    //     // console.log({one, two, three, four, otp});
    //
    //     return () => {
    //         setOtp([]);
    //         setOne("");
    //         setTwo("");
    //         setThree("");
    //         setFour("");
    //     };
    // }, [one, two, three, four]);


    //States
    const [one, setOne] = useState("");
    const [two, setTwo] = useState("");
    const [three, setThree] = useState("");
    const [four, setFour] = useState("");
    const [five, setFive] = useState("");
    const [six, setSix] = useState("");


    //Refs
    const firstRef = useRef();
    const secondRef = useRef();
    const thirdRef = useRef();
    const fourthRef = useRef();
    const fifthRef = useRef();
    const sixthRef = useRef();

    const _setOne = (val) => {
        _onChange(val, 0);
    }

    const _setTwo = (val) => {
        _onChange(val, 1);
    }

    const _setThree = (val) => {
        _onChange(val, 2);
    }

    const _setFour = (val) => {
        _onChange(val, 3);
    }

    const _setFive = (val) => {
        _onChange(val, 4);
    }

    const _setSix = (val) => {
        _onChange(val, 5);
    }
    //Functions
    const _onBlur = () => {

    }

    const _onFocus = () => {

    };

    const _onChange = (val, index) => {
        // console.log({val, index}, "other: ", Number.parseInt(index));
        // console.log({one, two, three, four})
        let arr = [...otp];
        if (val){
            arr[!index ? 0 : index] = val;
            setOtp(arr);
        }

        if(val !== undefined || val !== null || val.length !== 0 || !val) {
            if(index === 0){
                setOne(val);
                secondRef.current.focus();
            } else if (index === 1) {
                setTwo(val);
                thirdRef.current.focus();
            } else if (index === 2) {
                setThree(val);
                fourthRef.current.focus();
            } else if (index === 3) {
                setFour(val);
                fourthRef.current.focus();
            } else if (index === 4) {
                setFour(val);
                fifthRef.current.focus();
            } else if (index === 5) {
                setFour(val);
                sixthRef.current.blur();
            }
        } else {
            _onDelete(index)
        }

        console.log({val, index});

    };

    const _onDelete = (index) => {
        try{
            let arr = [...otp];
            if (index){
                arr[index].pop;
                setOtp([]);
                setOne("");
                setTwo("");
                setThree("");
                setFour("");
                setFive("");
                setSix("");
            }

            console.log({index});

            if(index === 0){
                //Add a toast
            } else if (index === 1) {
                firstRef.current.focus();
            } else if (index === 2) {
                secondRef.current.focus();
            } else if (index === 3) {
                thirdRef.current.focus();
            } else if (index === 4) {
                thirdRef.current.focus();
            } else if (index === 5) {
                thirdRef.current.focus();
            }

        } catch(error){
            _errorPrompt(error.message);
        }

    };


    return(
        <View style={styles.vContainer}>
            <View style={styles.container}>
                <View
                    style={[styles.viewContainer, viewStyle]}
                >
                    <TextInput
                        ref={firstRef}
                        style={[styles.input, inputStyle]}
                        maxLength={1}
                        onBlur={_onBlur}
                        onFocus={_onFocus}
                        value={one}
                        keyboardType={"number-pad"}
                        onChangeText={(e) => _setOne(e)}
                        onKeyPress={( {nativeEvent}) => {
                            nativeEvent.key === 'Backspace' &&
                                // _onDelete(0)
                                null
                                // _onChange(nativeEvent.text, 0)
                        }}
                    />
                </View>

                <View
                    style={[styles.viewContainer, viewStyle]}
                >
                    <TextInput
                        ref={secondRef}
                        style={[styles.input, inputStyle]}
                        maxLength={1}
                        onBlur={_onBlur}
                        onFocus={_onFocus}
                        value={two}
                        keyboardType={"number-pad"}
                        onChangeText={(e) => _setTwo(e)}
                        onKeyPress={({ nativeEvent }) => {
                            nativeEvent.key === 'Backspace' &&
                                // _onDelete(1)
                                // :
                                null
                                // _setTwo(nativeEvent.text);
                                // _onChange(nativeEvent.text, 1)
                        }}
                    />
                </View>

                <View
                    style={[styles.viewContainer, viewStyle]}
                >
                    <TextInput
                        ref={thirdRef}
                        style={[styles.input, inputStyle]}
                        maxLength={1}
                        onBlur={_onBlur}
                        onFocus={_onFocus}
                        value={three}
                        keyboardType={"number-pad"}
                        onChangeText={(e) => _setThree(e)}
                        onKeyPress={({ nativeEvent }) => {
                            nativeEvent.key === 'Backspace' &&
                                // _onDelete(2)
                                // :
                                // _onChange(nativeEvent.text, 2)
                                null
                        }}
                    />
                </View>

                <View
                    style={[styles.viewContainer, viewStyle]}
                >
                    <TextInput
                        ref={fourthRef}
                        style={[styles.input, inputStyle]}
                        maxLength={1}
                        onBlur={_onBlur}
                        onFocus={_onFocus}
                        value={four}
                        keyboardType={"number-pad"}
                        onChangeText={(e) => _setFour(e)}
                        onKeyPress={({ nativeEvent }) => {
                            nativeEvent.key === 'Backspace' &&
                                // _onDelete(3)
                                // :
                                // _onChange(nativeEvent.text, 3)
                                // _setFour(nativeEvent.text);
                                null
                        }}
                    />
                </View>

                <View
                    style={[styles.viewContainer, viewStyle]}
                >
                    <TextInput
                        ref={fifthRef}
                        style={[styles.input, inputStyle]}
                        maxLength={1}
                        onBlur={_onBlur}
                        onFocus={_onFocus}
                        value={five}
                        keyboardType={"number-pad"}
                        onChangeText={(e) => _setFive(e)}
                        onKeyPress={({ nativeEvent }) => {
                            nativeEvent.key === 'Backspace' &&
                            // _onDelete(3)
                            // :
                            // _onChange(nativeEvent.text, 3)
                            // _setFour(nativeEvent.text);
                            null
                        }}
                    />
                </View>

                <View
                    style={[styles.viewContainer, viewStyle]}
                >
                    <TextInput
                        ref={sixthRef}
                        style={[styles.input, inputStyle]}
                        maxLength={1}
                        onBlur={_onBlur}
                        onFocus={_onFocus}
                        value={six}
                        keyboardType={"number-pad"}
                        onChangeText={(e) => _setSix(e)}
                        onKeyPress={({ nativeEvent }) => {
                            nativeEvent.key === 'Backspace' &&
                            // _onDelete(3)
                            // :
                            // _onChange(nativeEvent.text, 3)
                            // _setFour(nativeEvent.text);
                            null
                        }}
                    />
                </View>

            </View>
        </View>
    )
}

export default CustomOTP;

const styles = StyleSheet.create({
    container: {width: "100%", flexDirection: "row", alignItems: "center", justifyContent: "space-evenly"},
    viewContainer: {
        width: WIDTH * 0.13, height: WIDTH * 0.13,
        alignItems: "center", justifyContent: "center",
        borderRadius: 10, borderWidth: 0.7, borderColor: "#E1E1E1",
    },
    input: {
        fontFamily: open_sans_bold, color: "#000",
        padding: 10, fontSize: 22,
    },
    vContainer: {
        width: "100%",
    },
    text1: {
        color: GREY,
        fontFamily: open_sans_light,
        fontSize: 12.5,
        padding: 20
    },
    text2: {
        color: PRIMARY_COLOR,
        fontFamily: open_sans_semibold,
        fontSize: 12
    }
})
