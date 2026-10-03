import api from './axios';

export const createBooking = (data) => api.post('/bookings', data);
export const getMyBookings = () => api.get('/bookings/my');
export const getPropertyBookings = (propertyId) => api.get(`/bookings/property/${propertyId}`);
export const cancelBooking = (id) => api.put(`/bookings/${id}/cancel`);
export const updateBookingStatus = (id, status) => api.put(`/bookings/${id}/status`, { status });
