import React, {useState, useMemo, useCallback, useEffect, useRef} from 'react';
import {StyleSheet, Text, View, Button, TextInput, TouchableOpacity, ScrollView, FlatList} from 'react-native';
import * as Animatable from "react-native-animatable";
import {Ionicons} from "react-native-vector-icons/";
import {BottomSheetModal, BottomSheetScrollView} from "@gorhom/bottom-sheet";
import {open_sans, open_sans_bold} from '../../constants/data/fonts';
// import StateList from "../../constants/file/currencies.json";
// import {gilroy, gilroy_bold} from "../../constants";

const CustomTextInput2 = ({
    onChangeText, ref, placeholder,
    value, onFocus, style, valid,
    props, keyboardType, setValue, phone,
    setCheck, less, other, email, title,
    // bottomSheetRef,
    sheetTitle, searchStyle, list,
    attach, containerStyle, setState,
}) => {

    useEffect(() => {
        // closeSheet();
    }, []);

    const bottomSheetRef = useRef(null);

    const [searchVal, setSearchVal] = useState("");
    const [newList, setNewList] = useState([]);

    const onSearch = (val) => {
        setSearchVal(val);
        const filter = list.filter((item) => {
            return item?.value?.toString()?.includes(`${val ? val : ""}`) || item?.label?.toString()?.includes(`${val ? val : ""}`);
        });
        setNewList(filter);
    }


    const [isValidValue, setIsValidValue] = useState({
        msg: title + ' is required!',
        check: isValidValue,
    });

    // variables
    const snapPoints = useMemo(() => ['25%', '50%'], []);

    // callbacks
    const handleSheetChanges = useCallback((index) => {
        console.log('handleSheetChanges', index);
    }, []);

    const closeSheet = () => {
        bottomSheetRef.current.close();
    }

    const showSheet = () => {
        bottomSheetRef.current.present();
    }

    const handleValidate = (val) => {
        setValue(val);
        console.log(value, " VR :: ", val);

        if (val.length <= 0) {
            setIsValidValue({
                msg: placeholder + ' is Empty',
                check: false,
            });
            setCheck(false);
        } else if (val.length < (less ? 1 : 3)) {
            setIsValidValue({
                msg: 'Invalid ' + placeholder,
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
        setValue(val);

        const regx2 =
            /(?:(?:\+?1\s*(?:[.-]\s*)?)?(?:(\s*([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9])\s*)|([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9]))\s*(?:[.-]\s*)?)([2-9]1[02-9]|[2-9][02-9]1|[2-9][02-9]{2})\s*(?:[.-]\s*)?([0-9]{4})/;

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
        console.log({val});
        setValue(val);

        const regx =
            /^([a-zA-Z0-9_.\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9\s]{2,4})+$/ ||
            /^([0-9\+\-])/;


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

    const statePicker = (value) => {
        let state = [];
        const newItem = StateList.filter((val) => val.name == value);
        // console.log("itemnew: ", newItem)
        newItem.map((item) => {
            item.states.map((v) => {
                state.push({ label: `${v.name}`, value: `${v.name}` });
                // console.log('state: ', state);
            });
        });

        console.log({state});

        setState(state);
        // return state;
    };

    return (
        <View style={[{width: "100%", marginBottom: 8}, containerStyle]}>
            {!attach &&
                <Text style={styles.text}>{title}</Text>
            }
            <TouchableOpacity style={[styles.rowView, {padding: 10}]} onPress={() => showSheet()}>
                <TextInput
                    ref={ref}
                    placeholder={placeholder}
                    autoCapitalize="none"
                    placeholderTextColor={'#ccc'}
                    value={title === "Currency" ? `${value?.label} - ${value?.value}` : value}
                    style={[
                        styles.input,
                        style,
                    ]}
                    editable = {false}
                    props
                />
                <IonicIcon name={"chevron-down"} style={{position: "absolute", right: 20}} color={"#000"} />
            </TouchableOpacity>

            {!isValidValue.check && !valid && (
                <Animatable.View animation="fadeInDown" duration={500}>
                    <Text
                        style={{
                            color: 'red',
                            fontSize: 12,
                            fontWeight: '600',
                            fontFamily: open_sans,
                        }}>
                        {isValidValue.msg}
                    </Text>
                </Animatable.View>
            )}

            <BottomSheetModal
                ref={bottomSheetRef}
                index={1}
                snapPoints={snapPoints}
                onChange={handleSheetChanges}
                enablePanDownToClose={false}
            >
                <View style={styles.bottomContainer}>
                    <View style={styles.rowView}>
                        <Text style={styles.title}>{sheetTitle}</Text>
                        <TouchableOpacity onPress={() => closeSheet()} style={{padding: 15, marginRight: -10}}>
                            <Ionicons name={"close"} size={20} />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.rowView} onPress={() => showSheet()}>
                        <IonicIcon name={"search"} style={{position: "absolute", left: 20}} color={"#000"} size={14} />

                        <TextInput
                            placeholder={placeholder}
                            // autoCapitalize="none"
                            placeholderTextColor={'#ccc'}
                            value={searchVal}
                            onChangeText={onSearch}
                            selectionColor={'#000'}
                            style={[
                                styles.input2,
                                searchStyle,
                            ]}
                            props
                        />
                    </View>

                    <BottomSheetScrollView showsVerticalScrollIndicator={false}>
                        <View style={styles.bottomV1}>
                            <FlatList
                                data={searchVal.length !== 0 ? newList : list}
                                renderItem={({item, index}) => (
                                    <TouchableOpacity
                                        style={[styles.rowView, {padding: 10, alignSelf: "center", marginBottom: 15}]}
                                        onPress={() => {
                                            console.log({item})
                                            setValue(title === "Currency" ? {value: item.value, label: item.label, sym: item.sym} : item.value);
                                            closeSheet();
                                            setCheck(true);
                                            setIsValidValue(prev => prev = {...prev, check: true})
                                            {
                                                // title === "Country" &&
                                                //     statePicker(item.value);
                                            }
                                        }}
                                        key={index.toString()}
                                    >
                                        <View style={styles.row}>
                                            <Text style={styles.text1}>{title === "Currency" && item.label} {item.value} </Text>
                                        </View>

                                        <View
                                            style={{
                                                borderWidth: 0.7, borderColor: "#ececec", padding: 5,
                                                borderRadius: 100, width: 17, height: 17,
                                                alignItems: "center", justifyContent: "center",
                                                alignSelf: "center", marginLeft: -20
                                            }}
                                        >
                                            {item.value == `${value}` &&
                                                <View style={{
                                                    width: 15,
                                                    height: 15,
                                                    backgroundColor: "#5E075F",
                                                    borderRadius: 100,
                                                    alignSelf: "center"
                                                }}/>
                                            }
                                        </View>
                                    </TouchableOpacity>
                                )}
                                keyExtractor={(_, index) => index.toString()}
                                // initialNumToRender={2}
                                // maxToRenderPerBatch={4}
                                // windowSize={5}
                            />
                        </View>
                    </BottomSheetScrollView>

                </View>
            </BottomSheetModal>
        </View>
    );

}

export default CustomTextInput2;

const styles = StyleSheet.create({
    input: {
        width: "100%",
        borderRadius: 8,
        padding: 10,
        borderWidth: 0.7,
        borderColor: '#ececec',
        fontSize: 12,
        color: 'black',
        fontFamily: open_sans,
    },
    input2: {
        width: "100%",
        borderRadius: 8,
        padding: 10,
        paddingLeft: 45,
        borderWidth: 0.7,
        borderColor: '#ececec',
        fontSize: 12,
        color: 'black',
        fontFamily: open_sans,
        alignSelf: "center"
    },
    text: {
        fontSize: 13,
        fontFamily: open_sans,
        marginVertical: 5
    },
    text1: {
        fontSize: 12,
        fontFamily: open_sans,
    },
    rowView: {
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    },
    row: {
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
    },
    bottomContainer: {
        flex: 1,
        width: "100%",
        padding: 20,
        paddingHorizontal: 30
    },
    title: {
        fontSize: 18,
        fontFamily: open_sans_bold,
    },
    bottomV1: {
        width: "100%",
        flex: 1,
        marginVertical: 20
    }
})
