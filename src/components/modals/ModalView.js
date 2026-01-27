import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StatusBar,
  Image,
  StyleSheet,
} from "react-native";
import React from "react";
import { HEIGHT, WIDTH } from "../../global";
import {normalize} from "react-native-elements";

//Modal for buying units or upgrade
const GModal = ({ visible, close, children, center, transparent, containerStyle, normal, ignoreTouch }) => {
  const _Modal = (onTouch) => {
    const view = <View style={{ flex: 1, width: "100%" }} />;

    if (!onTouch) return view;

    return (
      // background for the modal
      <TouchableWithoutFeedback
        style={{ flex: 1, width: "100%" }}
        onPress={ onTouch }
      >
        {view}
      </TouchableWithoutFeedback>
    );
  };

  return (
    <Modal
      style={[styles.modal, normal ? {flex: 0} : null]}
      transparent={true}
      visible={visible}
      animationType={"fade"}
      onRequestClose={() => close()}
    >
      {/* Container for the modal */}
      <StatusBar backgroundColor={"#000000a0"} />
      <View
        style={[{
          flex: normal ? 0 : 1,
          backgroundColor: transparent ? "transparent" : "#000000a0",
          justifyContent: "center",
          alignItems: "center",
        }, containerStyle]}
      >
        {_Modal(ignoreTouch ? null : close )}

        {children}
        {center === true ? _Modal( ignoreTouch ? null : close ) : null}
      </View>
    </Modal>
  );
};

export default GModal;

const styles = StyleSheet.create({
  tabText: {
    color: "#1C1C1C",
    fontSize: 12,
    textAlign: "center",
  },
  tabFocusedText: {
    color: "#EA0F07",
    fontSize: 14,
    fontWeight: "600",
  },
  tabView: {
    width: WIDTH * 0.45,
    backgroundColor: "#fff",
    padding: 20,
    flexDirection: "row",
    borderBottomColor: "#1C1C1C",
    alignItems: "center",
    justifyContent: "center",
  },
  modal: {
    width: WIDTH,
    flex: 1,
    backgroundColor: "#000000aa",
    justifyContent: "center",
    alignItems: "center",
    // zIndex: 100
  },
  bottomModal: {
    width: WIDTH * 0.9,
    height: HEIGHT * 0.63,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 15,
    bottom: -20,
  },
});
