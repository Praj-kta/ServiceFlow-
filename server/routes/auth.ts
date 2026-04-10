import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { sendEmail } from '../utils/email';
import { extractPincode } from '../utils/location';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'secret';

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [user, provider]
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: User already exists
 */
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { name, email, password, role, phone, address, companyName, experience, category, categories, pincode } = req.body;
    const normalizedEmail = (email || '').toString().trim().toLowerCase();

    if (!normalizedEmail || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userData: any = {
      name,
      email: normalizedEmail,
      password: hashedPassword,
      role,
      phone,
      address,
    };

    if (role === 'provider') {
      userData.providerProfile = {
        companyName,
        experience,
        pincode: pincode || extractPincode(address),
        // support both old single category field and new multi-category array
        category: typeof category === 'string' ? category : undefined,
        categories: Array.isArray(categories)
          ? categories
          : category
          ? [category]
          : [],
      };
    }

    const user = new User(userData);

    await user.save();

    const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
    res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error });
  }
});

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Invalid credentials
 */
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = (email || '').toString().trim().toLowerCase();

    if (!normalizedEmail || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error });
  }
});

// Get current authenticated user
router.get('/me', async (req: Request, res: Response) => {
  try {
    const authHeader = (req.headers.authorization || req.headers.Authorization) as string | undefined;
    if (!authHeader || !authHeader.startsWith('Bearer ')) return res.status(401).json({ message: 'No token provided' });
    const token = authHeader.split(' ')[1];
    const payload: any = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(payload.userId).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ user });
  } catch (error) {
    res.status(401).json({ message: 'Invalid token', error });
  }
});

/**
 * @swagger
 * /auth/forgot-password:
 *   post:
 *     summary: Send password reset link to email
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Email sent (or simulated) successfully
 *       500:
 *         description: Server error
 */
// forgot password - send reset link
router.post('/forgot-password', async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });

    const user = await User.findOne({ email });
    if (!user) {
      // To avoid leaking which emails are registered, respond success anyway
      return res.json({ message: 'If the email exists, a reset link will be sent' });
    }

    const token = require('crypto').randomBytes(20).toString('hex');
    user.resetPasswordToken = token;
    user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour
    await user.save();

    // prepare email
    const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:8080'}/reset-password?token=${token}`;
    await sendEmail({
      to: email,
      subject: 'ServiceFlow Password Reset',
      html: `<p>You requested a password reset. Click the link below to set a new password:</p>
             <p><a href="${resetUrl}">${resetUrl}</a></p>
             <p>This link will expire in 1 hour.</p>`
    });

    res.json({ message: 'If the email exists, a reset link will be sent' });
  } catch (error) {
    console.error('Forgot password error', error);
    res.status(500).json({ message: 'Error processing forgot password', error });
  }
});

/**
 * @swagger
 * /auth/reset-password:
 *   post:
 *     summary: Reset user password using token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *               - password
 *             properties:
 *               token:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password reset successful
 *       400:
 *         description: Invalid request or token expired
 *       500:
 *         description: Server error
 */
// reset password
router.post('/reset-password', async (req: Request, res: Response) => {
  try {
    const { token, password } = req.body;
    if (!token || !password) return res.status(400).json({ message: 'Token and new password are required' });

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() }
    });
    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    const hashed = await bcrypt.hash(password, 10);
    user.password = hashed;
    user.resetPasswordToken = undefined as any;
    user.resetPasswordExpires = undefined as any;
    await user.save();

    res.json({ message: 'Password has been reset successfully' });
  } catch (error) {
    console.error('Reset password error', error);
    res.status(500).json({ message: 'Error resetting password', error });
  }
});

export const authRouter = router;
