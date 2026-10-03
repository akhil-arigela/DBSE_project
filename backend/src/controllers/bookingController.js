const Booking = require('../models/bookingModel');
const Agent = require('../models/agentModel');

exports.createBooking = async (req, res, next) => {
  try {
    const bookingData = { ...req.body, buyer_id: req.user.user_id };
    const bookingId = await Booking.create(bookingData);
    res.status(201).json({ success: true, message: 'Booking requested successfully', data: { booking_id: bookingId } });
  } catch (error) {
    if (error.message === 'Slot not available') {
      return res.status(409).json({ success: false, message: 'This visit slot is already booked. Please choose another date or time.' });
    }
    next(error);
  }
};

exports.getUserBookings = async (req, res, next) => {
  try {
    let bookings = [];
    if (req.user.role === 'seller') {
      bookings = await Booking.findBySeller(req.user.user_id);
    } else if (req.user.role === 'agent') {
      const agent = await Agent.findByUserId(req.user.user_id);
      if (agent) {
        bookings = await Booking.findByAgent(agent.agent_id);
      }
    } else {
      bookings = await Booking.findByBuyer(req.user.user_id);
    }
    res.status(200).json({ success: true, data: bookings });
  } catch (error) {
    next(error);
  }
};

exports.getPropertyBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.findByProperty(req.params.propertyId);
    res.status(200).json({ success: true, data: bookings });
  } catch (error) {
    next(error);
  }
};

exports.cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    if (booking.buyer_id !== req.user.user_id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to cancel this booking' });
    }
    await Booking.updateStatus(req.params.id, 'cancelled');
    res.status(200).json({ success: true, message: 'Booking cancelled successfully' });
  } catch (error) {
    next(error);
  }
};

exports.updateBookingStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    await Booking.updateStatus(req.params.id, status);
    res.status(200).json({ success: true, message: `Booking marked as ${status}` });
  } catch (error) {
    next(error);
  }
};
