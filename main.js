import React from 'react';
import RootNav from "./src/routes/root";
import Toast from "react-native-toast-message";

const Main = (props) => {

    return(
        <>
            {props.children}
            <RootNav />
            <Toast />
        </>
    );
}

export default Main;
