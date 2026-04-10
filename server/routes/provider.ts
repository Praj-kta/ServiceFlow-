import { Router, Request, Response } from 'express';
import mongoose from 'mongoose';
import { Service } from '../models/Service';
import { Booking } from '../models/Booking';
import { Payment } from '../models/Payment';
import { Review } from '../models/Review';
import { User } from '../models/User';
import {
  extractPincode,
  matchesLocation,
  matchesPincode,
} from '../utils/location';

const router = Router();

router.get('/search', async (req: Request, res: Response) => {
  try {
    const requestedCategory = String(req.query.category || '').trim();
    const requestedServiceTitle = String(req.query.serviceTitle || '').trim();
    const requestedLocation = String(req.query.location || '').trim();
    const requestedPincode = String(req.query.pincode || '').trim();

    const serviceFilter: any = {
      status: { $ne: 'inactive' },
    };

    if (requestedCategory) {
      serviceFilter.category = new RegExp(`^${requestedCategory}$`, 'i');
    }

    if (requestedServiceTitle) {
      serviceFilter.title = new RegExp(`^${requestedServiceTitle}$`, 'i');
    }

    const services = await Service.find(serviceFilter).lean();
    const providerIds = Array.from(
      new Set(services.map((service: any) => String(service.providerId)).filter(Boolean)),
    );

    if (!providerIds.length) {
      return res.json([]);
    }

    const providers = await User.find({
      _id: { $in: providerIds },
      role: 'provider',
    })
      .select('name phone address providerProfile')
      .lean();

    const providerMap = new Map(
      providers.map((provider: any) => [String(provider._id), provider]),
    );

    const matches = services
      .map((service: any) => {
        const provider = providerMap.get(String(service.providerId));

        if (!provider) {
          return null;
        }

        const providerPincode =
          extractPincode(provider.providerProfile?.pincode) ||
          extractPincode(provider.address);

        const serviceAreas = Array.isArray(service.areasCovered)
          ? service.areasCovered
          : [];

        if (!matchesPincode(providerPincode, requestedPincode)) {
          return null;
        }

        if (
          providerPincode !== requestedPincode &&
          !matchesLocation(provider.address || '', serviceAreas, requestedLocation)
        ) {
          return null;
        }

        const rating = Number(provider.providerProfile?.rating ?? service.rating ?? 0);
        const reviews = Number(service.reviews ?? 0);
        const companyName = provider.providerProfile?.companyName || provider.name;

        return {
          providerId: String(provider._id),
          serviceId: String(service._id),
          name: provider.name,
          companyName,
          rating,
          reviews,
          phone: provider.phone || '',
          location: provider.address || requestedLocation || 'Nearby area',
          pincode: providerPincode,
          responseTime: 'Usually replies within 30 mins',
          price: service.price,
          features: Array.isArray(service.features) ? service.features : [],
          experience: provider.providerProfile?.experience || '',
          image: '/placeholder.svg',
        };
      })
      .filter(Boolean)
      .sort((a: any, b: any) => {
        const pincodeScore =
          Number(b.pincode === requestedPincode) - Number(a.pincode === requestedPincode);

        if (pincodeScore !== 0) {
          return pincodeScore;
        }

        return (b.rating || 0) - (a.rating || 0);
      });

    res.json(matches);
  } catch (error) {
    res.status(500).json({
      message: 'Error searching providers',
      error,
    });
  }
});

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
