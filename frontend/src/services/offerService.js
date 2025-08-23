import apiService from './api';

// Get all active offers
export const getOffers = async () => {
  try {
    const response = await apiService.get('/api/offers');
    return response;
  } catch (error) {
    console.error('Error fetching offers:', error);
    throw error;
  }
};

// Get offer by ID
export const getOfferById = async (id) => {
  try {
    const response = await apiService.get(`/api/offers/${id}`);
    return response;
  } catch (error) {
    console.error('Error fetching offer:', error);
    throw error;
  }
};

// Admin: Create new offer
export const createOffer = async (offerData) => {
  try {
    const response = await apiService.post('/api/offers', offerData);
    return response;
  } catch (error) {
    console.error('Error creating offer:', error);
    throw error;
  }
};

// Admin: Update offer
export const updateOffer = async (id, offerData) => {
  try {
    const response = await apiService.put(`/api/offers/${id}`, offerData);
    return response;
  } catch (error) {
    console.error('Error updating offer:', error);
    throw error;
  }
};

// Admin: Delete offer
export const deleteOffer = async (id) => {
  try {
    const response = await apiService.delete(`/api/offers/${id}`);
    return response;
  } catch (error) {
    console.error('Error deleting offer:', error);
    throw error;
  }
};

// Admin: Upload offer images
export const uploadOfferImages = async (images) => {
  try {
    const formData = new FormData();
    images.forEach(image => {
      formData.append('images', image);
    });
    
    const response = await apiService.post('/api/offers/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response;
  } catch (error) {
    console.error('Error uploading offer images:', error);
    throw error;
  }
};
