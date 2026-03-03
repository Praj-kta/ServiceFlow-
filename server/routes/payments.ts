import { Router, Request, Response } from 'express';
import { Payment } from '../models/Payment';
import { requireAuth } from '../middleware/auth';

const router = Router();

// Create payment request
/**
 * @swagger
 * /payments/request:
 *   post:
 *     summary: Create a payment request
 *     tags: [Payments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Payment'
 *     responses:
 *       201:
 *         description: Payment request created
 */
router.post('/request', requireAuth, async (req: Request, res: Response) => {
  try {
    const tokenUser: any = (req as any).user;
    const payment = new Payment({ ...req.body, userId: tokenUser.userId });
    await payment.save();
    res.status(201).json(payment);
  } catch (error) {
    res.status(500).json({ message: 'Error creating payment request', error });
  }
});

// Get payment history
/**
 * @swagger
 * /payments/history/{userId}:
 *   get:
 *     summary: Get payment history for a user
 *     tags: [Payments]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of payments
 */
router.get('/history/:userId', async (req: Request, res: Response) => {
  try {
    const payments = await Payment.find({ userId: req.params.userId });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching history', error });
  }
});

export const paymentRouter = router;
