import { Platform, StyleSheet, Text, TouchableOpacity, View, Switch } from 'react-native';
import React, { useEffect, useState } from 'react';
import tw from 'twrnc';
import Ionicons from 'react-native-vector-icons/Ionicons';
import useBiometricAuth from '../../hooks/biometric.hook';

const BiometricComponent = ({ signin = false, onComplete = null, toggle = false, fromRoute = '' }) => {
    const [toggling, setToggling] = useState(false);

    const {
        isBiometricExist,
        isBiometricReady,
        bmEnabled,
        bmPass,
        setBmPass,
        createKey,
        promptSignIn,
        deleteKey,
        navigateHome,
    } = useBiometricAuth();

    // Only ever flips the switch from the *resolved* result of createKey/deleteKey -
    // a cancelled or failed biometric prompt must leave it OFF, and disabling
    // always leaves it OFF, so the UI can never show "enabled" when it isn't.
    const toggleSwitch = async () => {
        if (toggling) return;
        setToggling(true);
        try {
            if (bmEnabled === 'true') {
                await deleteKey();
            } else {
                await createKey();
            }
        } finally {
            setToggling(false);
        }
    };

    useEffect(() => {
        if (bmPass) {
            if (onComplete != null) {
                onComplete();
            } else {
                navigateHome(fromRoute);
            }
            setBmPass(false);
        }
    }, [bmPass]);

    // Auto-trigger the biometric prompt on mount, but only once every gate is
    // satisfied: hardware+enrolled, user opted in, and a PIN actually exists
    // to submit on success.
    useEffect(() => {
        if (signin && isBiometricReady) {
            promptSignIn();
        }
    }, [signin, isBiometricReady]);

    if (!isBiometricExist) {
        return null;
    }

    if (toggle) {
        return (
            <View
                style={tw`bg-[#F8F8FA] rounded-[10px] px-3 py-4 flex w-full items-center flex-row justify-between border border-[#D0D5DD]`}>
                <Text style={tw`text-[#000000] font-medium text-[15px]`}>
                    Enable Face ID/Biometrics
                </Text>
                <Switch
                    trackColor={{ false: '#767577', true: 'red' }}
                    thumbColor={'white'}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={toggleSwitch}
                    disabled={toggling}
                    value={bmEnabled === 'true'}
                />
            </View>
        );
    }

    // Sign-in mode: don't show anything until biometrics can actually be used -
    // no confusing "disabled" placeholder taking up space on every PIN screen.
    if (!isBiometricReady) {
        return null;
    }

    return (
        <TouchableOpacity
            style={tw`flex flex-row items-center justify-center rounded-lg`}
            onPress={() => promptSignIn()}>
            <Ionicons
                name={Platform.OS === 'ios' ? 'scan-circle-outline' : 'finger-print-sharp'}
                size={25}
                color="gray"
            />
            <Text style={tw`ml-4 text-gray-500 text-center text-[14px]`}>
                Use {Platform.OS === 'ios' ? 'Face ID' : 'Fingerprint'} to unlock
            </Text>
        </TouchableOpacity>
    );
};

export default BiometricComponent;
