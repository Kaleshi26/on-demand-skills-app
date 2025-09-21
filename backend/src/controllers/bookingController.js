// backend/src/controllers/bookingController.js
import Booking from '../models/Booking.js';
import Service from '../models/Service.js';

export async function createBooking(req, res) {
  try {
    const { serviceId, scheduledAt, notes } = req.body;
    const svc = await Service.findById(serviceId).populate('owner');
    if (!svc) return res.status(404).json({ message: 'Service not found' });
    const booking = await Booking.create({
      service: svc._id,
      customer: req.user._id,
      provider: svc.owner._id,
      status: 'pending',
      scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
      notes: notes || '',
      totalPrice: svc.price
    });
    res.status(201).json(booking);
  } catch (e) {
    res.status(500).json({ message: 'Create booking failed' });
  }
}

export async function myBookings(req, res) {
  try {
    const role = req.user.role;
    const filter = role === 'provider' ? { provider: req.user._id } : { customer: req.user._id };
    const items = await Booking.find(filter).populate('service', 'title price').sort('-createdAt');
    res.json(items);
  } catch (e) {
    res.status(500).json({ message: 'List bookings failed' });
  }
}

export async function updateStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body; // pending|confirmed|completed|cancelled
    const booking = await Booking.findById(id);
    if (!booking) return res.status(404).json({ message: 'Not found' });
    // Simple permission: only provider can confirm/complete/cancel
    if (String(booking.provider) !== String(req.user._id)) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    booking.status = status;
    await booking.save();
    res.json(booking);
  } catch (e) {
    res.status(500).json({ message: 'Update failed' });
  }
}
