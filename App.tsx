/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect } from 'react';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import type {PropsWithChildren} from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import {
  Linking,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import Main from './main';
import { ThemeProvider } from './src/global/styles/theme';
import { Provider } from 'react-redux';
import configureStore from './src/contexts/stores/index';
function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const client = new QueryClient();

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };
  
  // useEffect(() => {
  //   const handleDeepLink = (event) => {
  //     console.log('Deep Link:', event.url);
  //   };
  
  //   Linking.addEventListener('url', handleDeepLink);
  //   return () => {
  //     Linking.removeAllListeners('url');
  //   };
  // }, []);
  return (
    <GestureHandlerRootView>
    <QueryClientProvider client={client}>

    <ThemeProvider>
      <Provider store={configureStore()}>
        <Main></Main>
      </Provider>
    </ThemeProvider>
  </QueryClientProvider>
  </GestureHandlerRootView>
  );
}

export default App;
