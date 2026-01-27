import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Modal, TextInput } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import tw from 'twrnc'; // Assuming you're using tailwind-rn for styling
import { Formik } from 'formik';
import * as Yup from 'yup';
import { styles } from '../style';
import Toast from 'react-native-toast-message';

const validationSchema = Yup.object().shape({
    phoneNumber: Yup.string().required('Phone number is required'),
});

const VerifyPhoneComponent = ({ phone, closeModal }) => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [otp, setOtp] = useState(Array(6).fill(''));
    const [step, setStep] = useState(1); // 1: Enter phone, 2: Enter OTP
    const [isVerified, setIsVerified] = useState(false);

    useEffect(() => {
        setPhoneNumber(phone);
    }, [])
    const handleVerifyPhone = () => {
        // Simulate OTP request
        Toast.show({
            type:'info',
            text1: 'ROLLING OUT',
            text2: 'This feature will be rolled out soon!!',
          });
          closeModal();
    };

    const handleOtpVerification = () => {
        // Simulate OTP verification
        if (otp.join('') === '123456') { // Replace with actual OTP check
            setIsVerified(true);
            setModalVisible(false);
        }
    };
    return (
        <View style={tw`flex-1 justify-end bg-black bg-opacity-50 p-4`}>
            <TouchableOpacity
                style={tw`p-1 bg-[#F3F4F6] items-center justify-center rounded-full w-[30px] h-[30px]`}
                activeOpacity={0.65}
                onPress={closeModal}>
                <Ionicons name="chevron-back" size={13} color="#000" />
            </TouchableOpacity>
            <Formik
                initialValues={{
                    phoneNumber: phoneNumber,
                }}
                validationSchema={validationSchema}
                onSubmit={handleVerifyPhone}>
                {({
                    handleChange,
                    handleBlur,
                    handleSubmit,
                    values,
                    errors,
                    touched,
                    setFieldValue,
                }) => (
                    <View style={tw`bg-white p-6 rounded-t-3xl`}>
                        {step === 1 ? (
                            <>
                                <Text style={tw`text-lg font-bold text-center text-black mb-4`}>
                                    Phone Verification
                                </Text>
                                <View style={styles.inputContainer}>
                                    <Text style={styles.infoTxt}>An OTP will be sent to your phone number, Please confirm your phone number before sending.</Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Phone Number"
                                        placeholderTextColor="#ccc"
                                        onChangeText={handleChange('phoneNumber')}
                                        onBlur={handleBlur('phoneNumber')}
                                        value={values.phoneNumber}
                                        keyboardType="phone-pad"
                                        maxLength={11}
                                    />
                                    {errors.phoneNumber && touched.phoneNumber && (
                                        <Text style={styles.errorText}>{errors.phoneNumber}</Text>
                                    )}
                                </View>
                                <TouchableOpacity
                                    style={tw`bg-green-500 p-3 rounded-md mt-4`}
                                    onPress={handleVerifyPhone}>
                                    <Text style={tw`text-white text-center font-medium`}>
                                        Send OTP
                                    </Text>
                                </TouchableOpacity>
                            </>
                        ) : (
                            <>
                                <Text style={tw`text-lg font-bold text-center mb-4`}>
                                    Enter the OTP sent to your phone
                                </Text>
                                <OtpInput otp={otp} setOtp={setOtp} />
                                <TouchableOpacity
                                    style={tw`bg-green-500 p-3 rounded-md mt-4`}
                                    onPress={handleOtpVerification}>
                                    <Text style={tw`text-white text-center font-medium`}>
                                        Verify OTP
                                    </Text>
                                </TouchableOpacity>
                            </>
                        )}
                    </View>)}
            </Formik>
        </View>
    )
}


// Reusable component for Phone Number Input
const PhoneNumberInput = ({ phoneNumber, setPhoneNumber }) => (
    <View style={tw`mb-4`}>
        <Text style={tw`text-white mb-2`}>
            Please enter your phone number to receive an OTP:
        </Text>
        <TextInput
            style={tw`bg-white p-2 rounded-md`}
            placeholder="Phone Number"
            placeholderTextColor="#ccc"
            keyboardType="phone-pad"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
        />
    </View>
);

// Reusable component for OTP Input
const OtpInput = ({ otp, setOtp }) => (
    <View style={tw`flex-row justify-center`}>
        {[...Array(6)].map((_, index) => (
            <TextInput
                key={index}
                style={tw`bg-white text-center p-2 w-10 h-10 mx-1 rounded-md`}
                keyboardType="number-pad"
                maxLength={1}
                value={otp[index] || ''}
                onChangeText={text => {
                    let newOtp = [...otp];
                    newOtp[index] = text;
                    setOtp(newOtp);
                }}
            />
        ))}
    </View>
);

export default VerifyPhoneComponent;