import api from './axios';

export const createReview = (data) => api.post('/reviews', data);
export const getPropertyReviews = (propertyId) => api.get(`/reviews/property/${propertyId}`);
export const getAgentReviews = (agentId) => api.get(`/reviews/agent/${agentId}`);
