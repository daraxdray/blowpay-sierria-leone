import {useQuery} from '@tanstack/react-query';
import notificationServices from '../services/notification.services'; // Import your notification services
import {_errorPrompt, _successPrompt} from '../utils'; // Import utilities

/**
 *
 * @return {Promise<*>}
 * @private
 */
export const useGetNotifications = () => {
  return useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const data = await notificationServices.getNotifications();
      
      return data;
    },

    onSuccess: data => {
      console.log('Notifications fetched:', data);
      return data;
    },
    onError: error => {
      _errorPrompt(error.message);
    },
  });
};

/**
 *
 * @param {string} id
 * @return {Promise<*>}
 * @private
 */
export const useGetNotificationById = id => {
  return useQuery({
    queryKey: ['notification', id], // Use the ID to uniquely cache the result
    queryFn: () => notificationServices.getNotById(id),
    onSuccess: data => {
      console.log('Notification fetched:', data);
      return data;
    },
    onError: error => {
      _errorPrompt(error.message);
    },
    enabled: !!id, // Prevent the query from running if no ID is provided
  });
};
