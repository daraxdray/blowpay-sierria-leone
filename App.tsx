/* eslint-disable react-native/no-inline-styles */
import React, {useEffect} from 'react';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {Provider} from 'react-redux';
import configureStore from './src/contexts/stores/index';
import Main from './main';
import {ThemeProvider} from './src/global/styles/theme';
import {
  requestUserPermission,
  setupNotificationListeners,
} from './src/services/push.notification.service';

export default function App() {
  const client = new QueryClient();

  useEffect(() => {
    const initializeNotifications = async () => {
      try {
        await requestUserPermission();
        const unsubscribe = setupNotificationListeners();
        return unsubscribe;
      } catch (error) {
        console.error('Failed to initialize notifications:', error);
      }
    };

    initializeNotifications();
  }, []);

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <QueryClientProvider client={client}>
        <ThemeProvider>
          <Provider store={configureStore()}>
            <Main />
          </Provider>
        </ThemeProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
