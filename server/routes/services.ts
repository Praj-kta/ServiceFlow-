import { Router, Request, Response } from 'express';
import { Service } from '../models/Service';
import { requireAuth } from '../middleware/auth';

const router = Router();

/**
 * @swagger
 * /services:
 *   get:
 *     summary: Get all services
 *     tags: [Services]
 *     responses:
 *       200:
 *         description: List of services
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Service'
 */
router.get('/', async (_req: Request, res: Response) => {
  try {
    const services = await Service.find();
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching services', error });
  }
});

/**
 * @swagger
 * /services/{id}:
 *   get:
 *     summary: Get service by ID
 *     tags: [Services]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Service details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Service'
 *       404:
 *         description: Service not found
 */
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    res.json(service);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching service', error });
  }
});

/**
 * @swagger
 * /services:
 *   post:
 *     summary: Create a new service
 *     tags: [Services]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Service'
 *     responses:
 *       201:
 *         description: Service created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Service'
 */
router.post('/', requireAuth, async (req: Request, res: Response) => {
  try {
    const tokenUser: any = (req as any).user;
    if (tokenUser?.role !== 'provider') return res.status(403).json({ message: 'Only providers can create services' });
    const service = new Service({ ...req.body, providerId: tokenUser.userId });
    await service.save();
    res.status(201).json(service);
  } catch (error) {

    res.status(500).json({ message: 'Error creating service', error });
  }
});
// Update a service
/**
 * @swagger
 * /services/{id}:
 *   put:
 *     summary: Update a service
 *     tags: [Services]
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
 *             $ref: '#/components/schemas/Service'
 *     responses:
 *       200:
 *         description: Service updated
 *       404:
 *         description: Service not found
 */
router.put('/:id', requireAuth, async (req: Request, res: Response) => {
  try {
    const tokenUser: any = (req as any).user;
    const serviceDoc = await Service.findById(req.params.id);
    if (!serviceDoc) return res.status(404).json({ message: 'Service not found' });
    if (tokenUser.role !== 'admin' && String(serviceDoc.providerId) !== tokenUser.userId) return res.status(403).json({ message: 'Forbidden' });
    const service = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(service);
  } catch (error) {
    res.status(500).json({ message: 'Error updating service', error });
  }
});

// Delete a service
/**
 * @swagger
 * /services/{id}:
 *   delete:
 *     summary: Delete a service
 *     tags: [Services]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Service deleted
 *       404:
 *         description: Service not found
 */
router.delete('/:id', requireAuth, async (req: Request, res: Response) => {
  try {
    const tokenUser: any = (req as any).user;
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ message: 'Service not found' });
    if (tokenUser.role !== 'admin' && String(service.providerId) !== tokenUser.userId) return res.status(403).json({ message: 'Forbidden' });
    await Service.findByIdAndDelete(req.params.id);
    res.json({ message: 'Service deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting service', error });
  }
});

/**
 * @swagger
 * /services/categories:
 *   get:
 *     summary: Get all unique service categories
 *     tags: [Services]
 *     responses:
 *       200:
 *         description: List of service categories
 */
router.get('/categories', async (_req: Request, res: Response) => {
  try {
    const categories = await Service.distinct('category');
    const subcategories = await Service.distinct('subcategory');
    res.json({ categories: categories.filter(Boolean), subcategories: subcategories.filter(Boolean) });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching categories', error });
  }
});

/**
 * @swagger
 * /services/by-category/:category:
 *   get:
 *     summary: Get services by category
 *     tags: [Services]
 *     parameters:
 *       - in: path
 *         name: category
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Services in category
 */
router.get('/by-category/:category', async (req: Request, res: Response) => {
  try {
    const services = await Service.find({ category: new RegExp(req.params.category, 'i') });
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching services', error });
  }
});

/**
 * @swagger
 * /services/by-location/:location:
 *   get:
 *     summary: Get services available in location
 *     tags: [Services]
 *     parameters:
 *       - in: path
 *         name: location
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Services available in location
 */
router.get('/by-location/:location', async (req: Request, res: Response) => {
  try {
    const location = req.params.location;
    const services = await Service.find({
      areasCovered: { $regex: location, $options: 'i' }
    });
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching services', error });
  }
});

/**
 * @swagger
 * /services/by-category/:category/subcategories:
 *   get:
 *     summary: Get subcategories for a category
 *     tags: [Services]
 *     parameters:
 *       - in: path
 *         name: category
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of subcategories
 */
router.get('/by-category/:category/subcategories', async (req: Request, res: Response) => {
  try {
    const subcategories = await Service.distinct('subcategory', {
      category: new RegExp(req.params.category, 'i')
    });
    res.json({ subcategories: subcategories.filter(Boolean) });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching subcategories', error });
  }
});

export const serviceRouter = router;
