import { Router, Request, Response } from 'express';
import mongoose from 'mongoose';
import { Service } from '../models/Service';
import { Booking } from '../models/Booking';
import { Payment } from '../models/Payment';
import { Review } from '../models/Review';

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

    // Earnings for this month (completed payments tied to this provider)
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const nextMonthStart = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    const earningsResult = await Payment.aggregate([
      { $match: { status: 'completed', createdAt: { $gte: monthStart, $lt: nextMonthStart } } },
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

    // Average rating (from reviews for this provider)
    const ratingResult = await Review.aggregate([
      { $match: { providerId: new mongoose.Types.ObjectId(providerId) } },
      {
        $group: {
          _id: null,
          averageRating: { $avg: '$rating' },
          count: { $sum: 1 }
        }
      }
    ]);

    const rating = ratingResult[0]?.averageRating || 0;

    const activeServices = await Service.countDocuments({ providerId });

    res.json({
      totalJobs,
      earnings,
      rating,
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

    let jobs = await Booking.find({
      serviceId: { $in: serviceIds }
    })
      .populate('userId', 'name')
      .populate('serviceId', 'title price providerId')
      .sort({ createdAt: -1 });

    // Only show recently cancelled jobs (last 24 hours)
    const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000);
    jobs = jobs.filter((job: any) => {
      if (job.status !== 'cancelled') return true;
      const cancelledAt = job.cancelledAt ? new Date(job.cancelledAt) : job.updatedAt ? new Date(job.updatedAt) : job.createdAt;
      return cancelledAt >= cutoff;
    });

    res.json(jobs);

  } catch (error) {
    res.status(500).json({
      message: 'Error fetching jobs',
      error
    });
  }
});

export const providerRouter = router;