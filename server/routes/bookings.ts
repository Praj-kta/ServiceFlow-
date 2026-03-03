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
    const { status } = req.body;
    const booking = await Booking.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Error updating booking status', error });
  }
});

export const bookingRouter = router;
