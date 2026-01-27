export * from "./sizes";


import {Platform, StyleSheet} from 'react-native';
import { useColorScheme } from 'react-native'; // for light and dark mode detection


// Color Constants
export const COLORS = {
  light: {
    background: '#FFFFFF',
    primaryText: '#000000',
    secondaryText: '#5A5A5A',
    border: '#D0D5DD',
    cardBackground: '#FFF8FB',
    buttonBackground: '#4CAF50', // Example primary button color
  },
  dark: {
    background: '#000000',
    primaryText: '#FFFFFF',
    secondaryText: '#CCCCCC',
    border: '#303030',
    cardBackground: '#1C1C1E',
    buttonBackground: '#00796B', // Example primary button color
  },
};

export const styles = colorScheme => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colorScheme.background,
        alignItems: 'center',
        justifyContent: 'center',
      },
      title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colorScheme.primaryText,
        textAlign: 'center',
        marginBottom: 10,
      },
      centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colorScheme.background,
      },
      card: {
        width: '90%',
        padding: 15,
        borderRadius: 10,
        backgroundColor: colorScheme.cardBackground,
        shadowColor: colorScheme.primaryText,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        marginVertical: 10,
      },
      text: {
        color: colorScheme.primaryText,
        fontSize: 16,
        lineHeight: 24,
      },
      secondaryText: {
        color: colorScheme.secondaryText,
        fontSize: 14,
        lineHeight: 20,
      },
      input: {
        height: 50,
        borderColor: colorScheme.border,
        borderWidth: 1,
        color: colorScheme.primaryText,
        borderRadius: 10,
        paddingHorizontal: 10,
        backgroundColor: theme === 'dark' ? '#333' : '#FFFFFF',
      },
      button: {
        backgroundColor: colorScheme.buttonBackground,
        paddingVertical: 12,
        paddingHorizontal: 25,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
      },
      buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
      },
      header: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colorScheme.primaryText,
        textAlign: 'center',
        marginVertical: 15,
      },
      shadow: {
        shadowColor: colorScheme.primaryText,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
        elevation: 8,
      },
      row: {
        flexDirection: 'row',
        alignItems: 'center',
      },
      divider: {
        height: 1,
        width: '100%',
        backgroundColor: colorScheme.border,
        marginVertical: 10,
      },
});
