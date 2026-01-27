import React, {useState} from 'react';
import {View, Text, ScrollView, TouchableOpacity} from 'react-native';
import {styles} from "./style";
import {ScreenView} from "../../../global/wrappers";
import {BLACK, WHITE} from '../../../global/theme';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CustomTextInput from '../../../global/components/CustomTextInput';
import {CustomButton} from '../../../global/components';
import { useForgotPassword } from '../../../hooks/auth.hook';
import Toast from 'react-native-toast-message';
import Loader from '../../../components/modals/Loader';
// import { Header } from "../../../components/study";

const ForgotPassword = (props) => {
  const navigation = props.navigation;

    //states
    const [email, setEmail] = useState('');
    const [validEmail, setValidEmail] = useState(false);
    const {mutate, status} = useForgotPassword();
    const [message,setMessage] = useState(null);

    const sendResetPasswordEmail = () => {
        navigation.navigate('otp-screen', {emailAddress:email, triggerSend:true, resetPassword:true});
    }
    return (
      <ScreenView style={styles.container} light color={WHITE}>
        <ScrollView
          style={styles.viewContainer}
        >
            <View
                style={styles.header}
            >
                <TouchableOpacity
                    style={styles.btn}
                    activeOpacity={0.65}
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name="chevron-back" size={13} color={BLACK} />
                </TouchableOpacity>
            </View>
            <View style={styles.view1}>
                <View style={styles.v1}>
                    <Text style={styles.text1}>Reset your password</Text>
                    <Text style={styles.text11}>Enter your email address, and we will send you a link to rest your password</Text>
                </View>

                <View style={styles.v2}>
                    <CustomTextInput
                        value={email}
                        setValue={setEmail}
                        placeholder={"you@email.com"}
                        label={"Email"}
                        title={"Email"}
                        containerStyle={styles.inputCont1}
                        inputStyle={styles.input1}
                        email
                        valid={validEmail}
                        setCheck={setValidEmail}
                    />

                </View>
                    {message && <Text style={styles.text12}>{message}</Text>}

                <View style={styles.v3}>
                   {message?
                    <CustomButton
                        onPress={() => navigation.navigate('signin-screen')}
                        style={styles.btn1}
                        text={"Go to sign in"}
                    />
                    : <CustomButton
                        onPress={() => sendResetPasswordEmail()}
                        style={styles.btn1}
                        text={"Submit Email"}
                    />}
                </View>
            </View>
            {status === 'pending' && <Loader />}
        </ScrollView>
      </ScreenView>
    );
};

export default ForgotPassword;
