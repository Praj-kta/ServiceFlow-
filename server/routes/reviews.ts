import { Router, Request, Response } from 'express';
import { Review } from '../models/Review';
import { requireAuth } from '../middleware/auth';

const router = Router();

/**
 * @swagger
 * /reviews:
 *   post:
 *     summary: Submit a review
 *     tags: [Reviews]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Review'
 *     responses:
 *       201:
 *         description: Review submitted
 */
router.post('/', requireAuth, async (req: Request, res: Response) => {
  try {
    const tokenUser: any = (req as any).user;
    const review = new Review({ ...req.body, userId: tokenUser.userId });
    await review.save();
    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: 'Error submitting review', error });
  }
});

/**
 * @swagger
 * /reviews/{serviceId}:
 *   get:
 *     summary: Get reviews for a service
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: serviceId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of reviews
 */
router.get('/:serviceId', async (req: Request, res: Response) => {
  try {
    const reviews = await Review.find({ serviceId: req.params.serviceId }).populate('userId', 'name');
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching reviews', error });
  }
});

export const reviewRouter = router;
