import { Router, Request, Response } from 'express';

const router = Router();

// Smart Matching Mock
/**
 * @swagger
 * /ai/smart-matching:
 *   post:
 *     summary: AI Smart Matching for providers
 *     tags: [AI]
 *     responses:
 *       200:
 *         description: List of matched providers with scores
 */
router.post('/smart-matching', (req: Request, res: Response) => {
  res.json({
    matches: [
      { providerId: 'p1', name: 'Elite Build Co.', score: 0.98 },
      { providerId: 'p2', name: 'SafeHands Services', score: 0.95 }
    ]
  });
});

// Vastu Detection Mock
/**
 * @swagger
 * /ai/vastu-detection:
 *   post:
 *     summary: AI Vastu Detection
 *     tags: [AI]
 *     responses:
 *       200:
 *         description: Vastu analysis score and recommendations
 */
router.post('/vastu-detection', (req: Request, res: Response) => {
  res.json({
    score: 85,
    issues: ['Main entrance facing South-West'],
    recommendations: ['Place a Vastu pyramid at the entrance']
  });
});

// AI Chat
/**
 * @swagger
 * /ai/chat:
 *   post:
 *     summary: AI Service Assistant Chat
 *     tags: [AI]
 *     responses:
 *       200:
 *         description: AI response
 */
router.post('/chat', (req: Request, res: Response) => {
  const { message } = req.body;
  // Simple mock logic
  let reply = "I can help with that. Please verify your requirements.";
  let suggestions = ["Book Service", "Find Provider"];
  
  if (message?.toLowerCase().includes("plumber")) {
    reply = "I can help you find a plumber. Would you like to see available providers nearby?";
    suggestions = ["Show Plumbers", "Book Urgent", "Check Prices"];
  } else if (message?.toLowerCase().includes("cost")) {
    reply = "Service costs depend on the type of work. For a standard consultation, it's usually around ₹500.";
    suggestions = ["Get Quote", "View Rate Card"];
  }

  res.json({
    reply,
    suggestions,
    timestamp: new Date()
  });
});

export const aiRouter = router;
