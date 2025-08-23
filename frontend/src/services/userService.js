import apiService from './api';

export const getUserProfile = async () => {
  return await apiService.get('/api/users/me');
};

export const updateUserProfile = async (profileData) => {
  return await apiService.put('/api/users/me', profileData);
};
