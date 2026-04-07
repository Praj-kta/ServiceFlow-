import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { Booking } from '../models/Booking';
import { requireAuth, requireSelfOrAdmin } from '../middleware/auth';
import { User } from '../models/User';

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
  try {
    const user = await User.findById(req.params.id).select('name email phone address createdAt');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      id: String(user._id),
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      address: user.address || '',
      createdAt: user.createdAt
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profile', error });
  }
});

// Update user profile
router.put('/profile/:id', requireAuth, requireSelfOrAdmin, async (req: Request, res: Response) => {
  try {
    const { name, email, phone, address } = req.body;

    const updates: Record<string, string> = {};
    if (typeof name === 'string') updates.name = name.trim();
    if (typeof email === 'string') updates.email = email.trim().toLowerCase();
    if (typeof phone === 'string') updates.phone = phone.trim();
    if (typeof address === 'string') updates.address = address.trim();

    if (updates.email) {
      const existing = await User.findOne({
        email: updates.email,
        _id: { $ne: req.params.id }
      });
      if (existing) {
        return res.status(400).json({ message: 'Email already in use' });
      }
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('name email phone address createdAt');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      id: String(user._id),
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      address: user.address || '',
      createdAt: user.createdAt
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile', error });
  }
});

// Change password
router.post('/change-password/:id', requireAuth, requireSelfOrAdmin, async (req: Request, res: Response) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    // verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password incorrect' });
    }
    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    await user.save();
    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error changing password', error });
  }
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
