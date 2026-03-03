import { Router, Request, Response } from 'express';
import { Contract } from '../models/Contract';
import { requireAuth } from '../middleware/auth';

const router = Router();

/**
 * @swagger
 * /contracts:
 *   post:
 *     summary: Create a contract inquiry
 *     tags: [Contracts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Contract'
 *     responses:
 *       201:
 *         description: Contract created
 */
router.post('/', requireAuth, async (req: Request, res: Response) => {
  try {
    const tokenUser: any = (req as any).user;
    const contract = new Contract({ ...req.body, contactUserId: tokenUser.userId });
    await contract.save();
    res.status(201).json(contract);
  } catch (error) {
    res.status(500).json({ message: 'Error creating contract', error });
  }
});

export const contractRouter = router;
