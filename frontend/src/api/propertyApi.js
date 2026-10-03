import api from './axios';

export const getProperties = (filters) => {
  const params = new URLSearchParams(filters).toString();
  return api.get(`/properties?${params}`);
};
export const getProperty = (id) => api.get(`/properties/${id}`);
export const createProperty = (data) => api.post('/properties', data);
export const updateProperty = (id, data) => api.put(`/properties/${id}`, data);
export const deleteProperty = (id) => api.delete(`/properties/${id}`);
export const getMyProperties = () => api.get('/properties/my/listings');
