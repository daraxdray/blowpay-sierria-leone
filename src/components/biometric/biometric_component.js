import { Image, StyleSheet, Text, TouchableOpacity, View, ToastAndroid as Toast, Switch } from 'react-native';
import React, { useEffect, useState } from 'react';
import ReactNativeBiometrics from 'react-native-biometrics';
import AsyncStorage from '@react-native-async-storage/async-storage';
import tw from 'twrnc';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Loader from '../modals/Loader';
import useBiometricAuth from '../../hooks/biometric.hook';
import { useNavigation } from '@react-navigation/native';
const rnBiometrics = new ReactNativeBiometrics();


const BiometricComponent = ({ text = '', signin = false, onComplete = null, token = '', toggle = false, fromRoute = '' }) => {
    const [bioLoading, setBioLoading] = useState(false);
    const [activate, setActivate] = useState(false);
    const navigate = useNavigation();
    // const [keyFound, setKeyFound] = useState(false);
    const payload = Math.round(new Date().getTime() / 1000).toString() + 'login with biometric';

    const {isBiometricExist,keyFound, bmPass,bmEnabled, setBmEnabled, setBmPass, createKey, promptSignIn, deleteKey, navigateHome} = useBiometricAuth();
    const toggleSwitch = () => {
        if (bmEnabled) {
            deleteKey()
        } else {
            createKey();
        }
        setBmEnabled(previousState => !previousState);
    }

    useEffect(()=>{
        //check if the biometric passes and execute on complete function or go home
        if(bmPass){
            if(onComplete != null){
                onComplete();
            }else{
                    navigateHome(fromRoute);
                
            }
            setBmPass(false)
        }
    },[bmPass])

    // useEffect(() => {
    //     // Check if biometric keys exist on component mount
    //     rnBiometrics.biometricKeysExist().then(async (e) => {
    //         const storedPubKey = await AsyncStorage.getItem('bPK'); // get the bio pub key
    //         const enabledBm = await AsyncStorage.getItem('bmEnabled'); //check if bio is enabled
    //         setKeyFound(storedPubKey ? true : e.keysExist);
    //         setIsEnabled(enabledBm);
    //     });
    // }, []);



    // const isBioOn = async () => {
    //     if (keyFound) {
    //         setActivate(true);
    //         promptSignIn();
    //     } else {
    //         createKey();
    //     }
    // };

    // const deleteKey = async () => {
    //     await rnBiometrics.deleteKeys();
    //     await AsyncStorage.removeItem('bPK');
    //     await AsyncStorage.removeItem('bmEnabled');

    //     setKeyFound(false);
    //     Toast.show('Biometric deactivated', Toast.SHORT);
    // };

    // const createKey = () => {
    //     setBioLoading(true);
    //     rnBiometrics.createKeys()
    //         .then(async (resultObject) => {
    //             const { publicKey } = resultObject;
    //             setBioLoading(false);
    //             await AsyncStorage.setItem('bPK', publicKey); // store the pubKey of bio
    //             await AsyncStorage.setItem('bmEnabled', 'true');//store status of biometric enabled
    //             setKeyFound(true);
    //             Toast.show('Biometric Activated', Toast.SHORT);
    //             if (onComplete) onComplete(); // execute callback on completion if provided
    //         })
    //         .catch((e) => {
    //             Toast.show('Unable to generate sign key', Toast.SHORT);
    //             setBioLoading(false);
    //         });
    // };

    // const promptSignIn = async () => {
    //     const storedPubKey = await AsyncStorage.getItem('bPK');
    //     if (!storedPubKey) {
    //         Toast.show('Please sign in first with your email', Toast.SHORT);
    //     } else {
    //         setBioLoading(true);
    //         rnBiometrics.createSignature({
    //             promptMessage: 'Sign in',
    //             payload: payload
    //         })
    //             .then((resultObject) => {
    //                 const { success, signature } = resultObject;
    //                 setBioLoading(false);
    //                 if (success) {
    //                     Toast.show('Authorization successful', Toast.SHORT);
    //                     if (onComplete) onComplete(signature); // execute callback on successful biometric
    //                 }
    //             })
    //             .catch((e) => {
    //                 Toast.show('No biometric data identified, please login using email', Toast.SHORT);
    //                 setBioLoading(false);
    //             });
    //     }
    // };

    return (
         !isBiometricExist? 
            <></> 
            :
        <View>
            {toggle ? <>
                <View
                    style={tw`bg-[#F8F8FA] rounded-[10px] px-3 py-4 flex w-full items-center flex-row justify-between border border-[#D0D5DD]`}>
                    <Text style={tw`text-[#000000] font-medium text-[15px]`}>
                        Enable Face ID/Biometrics
                    </Text>
                    <Switch
                        trackColor={{ false: '#767577', true: 'red' }}
                        thumbColor={bmEnabled ? 'white' : 'white'}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={toggleSwitch}
                        value={!!bmEnabled}
                    />
                </View>
            </> :
                <>
                    {keyFound ? (
                        <>
                            { (
                                <TouchableOpacity style={tw`flex flex-row items-center justify-center rounded-lg `} onPress={() => (signin ? promptSignIn() : createKey())}>
                                    {/* <View style={tw`flex flex-row items-center justify-center rounded-lg`}>
                                        
                                    </View>     */}
                                    <Ionicons
                                        name={
                                            Platform.OS === 'ios'
                                                ? 'scan-circle-outline'
                                                : 'finger-print-sharp'
                                        }
                                        size={25}
                                        color="gray"
                                    />
                                    <Text
                                        style={tw`ml-4 text-gray-500 text-center text-[14px]`}>
                                        Use {Platform.OS === 'ios' ? 'Face ID' : 'Fingerprint'} to
                                        unlock
                                    </Text>
                                </TouchableOpacity>
                            )}
                            {/* <Text style={styles.orLoginWith}>{text}</Text> */}
                        </>
                    ) : <Text
                    style={tw`ml-4 text-gray-500 text-center text-[14px]`}>
                    {Platform.OS === 'ios' ? 'Face ID' : 'Fingerprint'} Disabled 
                </Text>}
                    {signin ? null : (
                        <View style={{ alignContent: 'center', justifyContent: 'center', flexDirection: 'row' }}>
                            <Text style={{}}>
                                Click on the thumb to {keyFound ? 'OFF' : 'ON'} fingerprint
                            </Text>
                        </View>
                    )}
                </>}
        </View>
    );
};

export default BiometricComponent;

const styles = StyleSheet.create({
    fingerprintView: {
        // add your styling here
    },
    fingerprintBtn: {
        // add your styling here
    },
    orLoginWith: {
        // add your styling here
    },
});