import api from './axios';

export const uploadMedia = (formData) => api.post('/media/upload', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
export const getPropertyMedia = (propertyId) => api.get(`/media/${propertyId}`);
export const deleteMedia = (id) => api.delete(`/media/${id}`);
