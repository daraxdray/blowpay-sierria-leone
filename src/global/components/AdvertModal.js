import React from 'react';
import {
  Modal,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
} from 'react-native';

const { width, height } = Dimensions.get('window');

const AdvertModal = ({
  visible,
  onClose,
  imageSource,
  imageStyle = {},
  closePosition = 'topRight', // 'topRight' or 'bottom'
  closeIconSource,
  backdropOpacity = 0.7,
  borderRadius = 20,
}) => {
  const defaultCloseIcon = require('../../../assets/icons/close.png'); // Update path as needed

  const renderCloseButton = () => {
    const closeButton = (
      <TouchableOpacity
        style={[
          styles.closeButton,
          closePosition === 'bottom' ? styles.closeButtonBottom : styles.closeButtonTop
        ]}
        onPress={onClose}
        activeOpacity={0.8}
      >
        <Image
          source={closeIconSource || defaultCloseIcon}
          style={styles.closeIcon}
          resizeMode="contain"
        />
      </TouchableOpacity>
    );

    return closeButton;
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
      statusBarTranslucent={true}
    >
      <View style={[styles.backdrop, { backgroundColor: `rgba(0, 0, 0, ${backdropOpacity})` }]}>
        <TouchableOpacity
          style={styles.backdropTouchable}
          activeOpacity={1}
          onPress={onClose}
        >
          <View style={styles.modalContainer}>
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => {}} // Prevent modal close when touching the content
              style={[
                styles.imageContainer,
                { borderRadius },
                imageStyle
              ]}
            >
              <Image
                source={imageSource}
                style={[
                  styles.advertImage,
                  { borderRadius },
                  imageStyle
                ]}
                resizeMode="contain"
              />
              
              {closePosition === 'topRight' && renderCloseButton()}
            </TouchableOpacity>
            
            {closePosition === 'bottom' && renderCloseButton()}
          </View>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backdropTouchable: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  modalContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  imageContainer: {
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 15,
  },
  advertImage: {
    width: width * 0.85,
    height: height * 0.6,
    maxWidth: 400,
    maxHeight: 600,
  },
  closeButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 25,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  closeButtonTop: {
    position: 'absolute',
    top: -10,
    right: -10,
    zIndex: 1,
  },
  closeButtonBottom: {
    marginTop: 20,
  },
  closeIcon: {
    width: 24,
    height: 24,
    tintColor: '#333',
  },
});

export default AdvertModal;