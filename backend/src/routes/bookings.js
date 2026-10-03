const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { verifyToken } = require('../middleware/auth');
const { requireRole } = require('../middleware/roleGuard');

router.post('/', verifyToken, requireRole('buyer'), bookingController.createBooking);
router.get('/my', verifyToken, bookingController.getUserBookings);
router.get('/property/:propertyId', verifyToken, requireRole('seller', 'agent'), bookingController.getPropertyBookings);
router.put('/:id/cancel', verifyToken, requireRole('buyer'), bookingController.cancelBooking);
router.put('/:id/status', verifyToken, requireRole('seller', 'agent'), bookingController.updateBookingStatus);

module.exports = router;
