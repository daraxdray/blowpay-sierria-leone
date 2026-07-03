/* eslint-disable react-native/no-inline-styles */
import React, {useEffect} from 'react';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {Provider} from 'react-redux';
import configureStore from './src/contexts/stores/index';
import Main from './main';
import {ThemeProvider} from './src/global/styles/theme';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {
  setupNotificationListeners,
  promptForNotificationPermissionIfNeeded,
} from './src/services/push.notification.service';

export default function App() {
  const client = new QueryClient();

  useEffect(() => {
    const unsubscribe = setupNotificationListeners();

    // Show in-app alert to allow notifications (Android/iOS) after app is visible
    const timer = setTimeout(() => {
      promptForNotificationPermissionIfNeeded();
    }, 1500);

    return () => {
      clearTimeout(timer);
      typeof unsubscribe === 'function' && unsubscribe();
    };
  }, []);

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{flex: 1}}>
        <QueryClientProvider client={client}>
          <ThemeProvider>
            <Provider store={configureStore()}>
              <Main />
            </Provider>
          </ThemeProvider>
        </QueryClientProvider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}
