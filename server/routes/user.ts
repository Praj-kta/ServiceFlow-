import { Router, Request, Response } from 'express';
import { Booking } from '../models/Booking';
import { requireAuth, requireSelfOrAdmin } from '../middleware/auth';

const router = Router();

// Get user dashboard stats
/**
 * @swagger
 * /user/dashboard/{userId}:
 *   get:
 *     summary: Get user dashboard stats
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User statistics
 */
router.get('/dashboard/:userId', requireAuth, requireSelfOrAdmin, async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const bookings = await Booking.countDocuments({ userId });
    
    res.json({
      totalBookings: bookings,
      amountSpent: 18400, // Mock
      completedServices: 18, // Mock
      favorites: 12 // Mock
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user stats', error });
  }
});

// Get user profile
router.get('/profile/:id', requireAuth, requireSelfOrAdmin, async (req: Request, res: Response) => {
  // In real app, fetch from User model
  res.json({ id: req.params.id, name: 'John Doe', email: 'john@example.com', phone: '+91 9876543210' });
});

// Update user profile
router.put('/profile/:id', requireAuth, requireSelfOrAdmin, async (req: Request, res: Response) => {
  res.json({ message: 'Profile updated', ...req.body });
});

// Get favorites
router.get('/favorites/:userId', async (req: Request, res: Response) => {
  res.json([
    { id: '1', name: 'Elite Cleaners', service: 'Home Cleaning', rating: 4.8 },
    { id: '2', name: 'RapidFix', service: 'Plumbing', rating: 4.5 }
  ]);
});

// Get transactions
router.get('/transactions/:userId', async (req: Request, res: Response) => {
  res.json([
    { id: 'tx1', date: '2024-01-20', amount: 500, status: 'success', description: 'Plumbing Service' },
    { id: 'tx2', date: '2024-01-15', amount: 1200, status: 'success', description: 'House Cleaning' }
  ]);
});

export const userRouter = router;
