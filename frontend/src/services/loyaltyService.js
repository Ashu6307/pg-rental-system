import apiService from './api';

const API_BASE = '/api/user-loyalty';

export const getLoyaltyPoints = async () => {
  try {
    const res = await apiService.get(API_BASE);
    return res.data || res;
  } catch (error) {
    console.error('Error fetching loyalty points:', error);
    throw error;
  }
};

export const addLoyaltyPoints = async (points, reason) => {
  try {
    const res = await apiService.post(`${API_BASE}/add`, { points, reason });
    return res.data || res;
  } catch (error) {
    console.error('Error adding loyalty points:', error);
    throw error;
  }
};

export const redeemReward = async (rewardId, pointsRequired) => {
  try {
    const res = await axios.post(`${API_BASE}/redeem`, { rewardId, pointsRequired }, { headers: getAuthHeaders() });
    return res.data;
  } catch (error) {
    console.error('Error redeeming reward:', error);
    throw error;
  }
};
