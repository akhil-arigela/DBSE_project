import api from './axios';

export const getAgents = () => api.get('/agents');
export const getAgent = (id) => api.get(`/agents/${id}`);
export const updateAgentProfile = (data) => api.put('/agents/profile', data);
