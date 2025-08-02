import {
    StyleSheet,
    TouchableWithoutFeedback,
    Text,
    View,
    Modal,
    Dimensions,
    TextInput,
    TouchableOpacity,
} from 'react-native';
import React from 'react';
import AnimatedLottieView from 'lottie-react-native';
import { HEIGHT, WIDTH } from '../styles';


export class LoaderModal extends React.Component{
    constructor(props){
        super(props)
        this.state={
            show: false,
        }
    }

    renderOutsideTouchable(onTouch){
        const view = <View style={{flex: 0.3, width: '100%'}} />
        if(!onTouch) return view
        
        return(
            <TouchableWithoutFeedback style={{flex: 1, width: '100%'}} onPress={onTouch} >
                {view}
            </TouchableWithoutFeedback>
        )
    }

   
    render() {
        const {visible, close } = this.props;

        return(
            <Modal
                animationType='fade'
                visible={visible}
                transparent={true}
                onRequestClose={close}
            >
                <View style={{flex: 1, backgroundColor: '#000000aa', justifyContent: 'flex-end'}}>
                    <View style={styles.spincontainer}> 
                        <AnimatedLottieView
                        source={require('../../../assets/fonts/spend.json')} autoPlay loop duration={3500}
                        style={{width: 210, height: 210}}
                        />
                    </View>

                </View>

            </Modal>
        )
    }
}



const styles = StyleSheet.create({
    view1:{
        flex: 1,
        width: '100%',
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20,
        height: HEIGHT * 0.95,
        backgroundColor: '#fff', 
    },
    bottomSave:{
        width: '100%',
        padding: 20,
        justifyContent: 'flex-end',
        bottom: HEIGHT * 0.05, 
        top: 15
    },
    touch:{
        width: '100%',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#aaa'
    },
    saveBtn:{
        color: 'white',
        fontWeight: '600',
        fontSize: 15
    },
    touch2:{
        width: '100%',
        backgroundColor: '#640c75',
        padding: 20,
        borderRadius: 8,
        alignItems: 'center'
    },
    view2:{
        borderBottomWidth: 0.1,
        elevation: 1,
        width: '100%',
        
    },
    view3:{
        padding: 20
    },
    text1:{
        padding: 20,
        color: '#640c75',
        fontSize: 16,
        fontWeight: '700',
    },
    input:{
        borderWidth: 1,
        borderColor: "#aaa",
        borderRadius: 5,
        padding: 10,
        color: 'black',
    },
    spincontainer: {
        flex: 1,
        width: WIDTH,
        alignItems: "center",
        justifyContent: "center"
    },
    text2: {
        color: "#000",
        fontWeight: '600',
        marginVertical: 10,
    }
})