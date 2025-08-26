import apiService from './api';

export const getNotifications = async () => {
  return await apiService.get('/api/notifications');
};

export const markNotificationRead = async (id) => {
  return await apiService.put(`/api/notifications/${id}/read`);
};
