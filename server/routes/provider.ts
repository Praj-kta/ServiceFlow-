import { Router, Request, Response } from 'express';
import mongoose from 'mongoose';
import { Service } from '../models/Service';
import { Booking } from '../models/Booking';
import { Payment } from '../models/Payment';

const router = Router();

/**
 * Get Provider Dashboard Stats
 */
router.get('/dashboard/:providerId', async (req: Request, res: Response) => {
  try {
    const { providerId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(providerId)) {
      return res.status(400).json({ message: 'Invalid providerId' });
    }

    // Get all services of this provider
    const serviceIds = await Service.find({ providerId }).distinct('_id');

    // Total Jobs
    const totalJobs = await Booking.countDocuments({
      serviceId: { $in: serviceIds }
    });

    // Total Earnings (only completed payments)
    const earningsResult = await Payment.aggregate([
      { $match: { status: 'completed' } },
      {
        $lookup: {
          from: 'bookings',
          localField: 'bookingId',
          foreignField: '_id',
          as: 'booking'
        }
      },
      { $unwind: '$booking' },
      { $match: { 'booking.serviceId': { $in: serviceIds } } },
      {
        $group: {
          _id: null,
          totalEarnings: { $sum: '$amount' }
        }
      }
    ]);

    const earnings = earningsResult[0]?.totalEarnings || 0;

    const activeServices = await Service.countDocuments({ providerId });

    res.json({
      totalJobs,
      earnings,
      rating: 0, // Add rating field in Booking schema if needed
      activeServices
    });

  } catch (error) {
    res.status(500).json({
      message: 'Error fetching provider stats',
      error
    });
  }
});


/**
 * Get Provider Jobs
 */
router.get('/jobs/:providerId', async (req: Request, res: Response) => {
  try {
    const { providerId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(providerId)) {
      return res.status(400).json({ message: 'Invalid providerId' });
    }

    const serviceIds = await Service.find({ providerId }).distinct('_id');

    const jobs = await Booking.find({
      serviceId: { $in: serviceIds }
    })
      .populate('userId', 'name')
      .populate('serviceId', 'title price')
      .sort({ createdAt: -1 });

    res.json(jobs);

  } catch (error) {
    res.status(500).json({
      message: 'Error fetching jobs',
      error
    });
  }
});

export const providerRouter = router;