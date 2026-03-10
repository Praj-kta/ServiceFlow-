import { Router, Request, Response } from 'express';
import { Booking } from '../models/Booking';
import { requireAuth } from '../middleware/auth';

const router = Router();

/**
 * @swagger
 * /bookings:
 *   post:
 *     summary: Create a newly booking
 *     tags: [Bookings]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Booking'
 *     responses:
 *       201:
 *         description: Booking created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Booking'
 */
router.post('/', requireAuth, async (req: Request, res: Response) => {
  try {
    // Ensure booking is created by the authenticated user
    const tokenUser: any = (req as any).user;
    const booking = new Booking({ ...req.body, userId: tokenUser.userId });
    await booking.save();
    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Error creating booking', error });
  }
});

/**
 * @swagger
 * /bookings/user/{userId}:
 *   get:
 *     summary: Get bookings for a user
 *     tags: [Bookings]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of user bookings
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Booking'
 */
router.get('/user/:userId', async (req: Request, res: Response) => {
  try {
    const bookings = await Booking.find({ userId: req.params.userId }).populate('serviceId');
    res.json(bookings);
  } catch (error) {

    res.status(500).json({ message: 'Error fetching bookings', error });
  }
});
// Update booking status
/**
 * @swagger
 * /bookings/{id}/status:
 *   put:
 *     summary: Update booking status
 *     tags: [Bookings]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, confirmed, completed, cancelled]
 *     responses:
 *       200:
 *         description: Status updated
 *       404:
 *         description: Booking not found
 */
router.put('/:id/status', requireAuth, async (req: Request, res: Response) => {
  try {
    const { status, note } = req.body;

    const update: any = { status };
    if (status === 'cancelled') {
      update.cancelledAt = new Date();
      update.declineNote = note || '';
    } else {
      // Clear cancellation info when moving back to an active state
      update.cancelledAt = undefined;
      update.declineNote = undefined;
    }

    const booking = await Booking.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Error updating booking status', error });
  }
});

// Edit booking (user can update if still pending)
/**
 * @swagger
 * /bookings/{id}:
 *   put:
 *     summary: Edit a booking (pending only)
 *     tags: [Bookings]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               date:
 *                 type: string
 *                 format: date-time
 *               notes:
 *                 type: string
 *               fullAddress:
 *                 type: string
 *               pincode:
 *                 type: string
 *               timeSlot:
 *                 type: string
 *               isUrgent:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Booking updated
 *       403:
 *         description: Forbidden or not pending
 *       404:
 *         description: Booking not found
 */
router.put('/:id', requireAuth, async (req: Request, res: Response) => {
  try {
    const tokenUser: any = (req as any).user;
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    if (String(booking.userId) !== tokenUser.userId) return res.status(403).json({ message: 'Forbidden' });
    if (booking.status !== 'pending') return res.status(403).json({ message: 'Can only edit pending bookings' });

    // apply allowed fields
    const fields = ['date', 'notes', 'fullAddress', 'pincode', 'timeSlot', 'isUrgent'];
    fields.forEach((f) => {
      if (req.body[f] !== undefined) booking.set(f, req.body[f]);
    });
    await booking.save();
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Error editing booking', error });
  }
});

// Delete / cancel booking (user may only remove pending)
/**
 * @swagger
 * /bookings/{id}:
 *   delete:
 *     summary: Cancel a booking (pending only)
 *     tags: [Bookings]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Booking deleted
 *       403:
 *         description: Forbidden or not pending
 *       404:
 *         description: Booking not found
 */
router.delete('/:id', requireAuth, async (req: Request, res: Response) => {
  try {
    const tokenUser: any = (req as any).user;
    const booking = await Booking.findById(req.params.id).populate('serviceId');
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    // Allow users to cancel their own pending bookings
    if (String(booking.userId) === tokenUser.userId) {
      if (booking.status !== 'pending') return res.status(403).json({ message: 'Can only cancel pending bookings' });
      await Booking.findByIdAndDelete(req.params.id);
      return res.json({ message: 'Booking deleted' });
    }

    // Allow providers to delete their own cancelled bookings (cleanup)
    if (tokenUser.role === 'provider') {
      const service: any = booking.serviceId;
      if (service?.providerId && String(service.providerId) === tokenUser.userId && booking.status === 'cancelled') {
        await Booking.findByIdAndDelete(req.params.id);
        return res.json({ message: 'Cancelled booking deleted by provider' });
      }
    }

    return res.status(403).json({ message: 'Forbidden' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting booking', error });
  }
});

export const bookingRouter = router;
