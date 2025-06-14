import { Router, Request, Response } from 'express';
import { ensureAdminAuthenticated } from '../middleware/auth.middleware';
import { Subscription } from '../models/Subscription';

const router = Router();

console.log('🔗 Setting up subscription routes...');

// Add a subscriber email
router.post('/add', ensureAdminAuthenticated, async (req: Request, res: Response): Promise<void> => {
  const { email } = req.body;
  console.log(`📝 Adding subscriber email: ${email}`);

  if (!email || !email.includes('@')) {
    console.error('❌ Invalid email');
    res.status(400).json({ error: 'Valid email is required' });
    return;
  }

  try {
    const existingSub = await Subscription.findOne({ email: email.toLowerCase().trim() });
    if (existingSub) {
      console.error(`❌ Email already subscribed: ${email}`);
      res.status(400).json({ error: 'Email already subscribed' });
      return;
    }

    const subscription = await Subscription.create({ email: email.toLowerCase().trim() });
    console.log(`✅ Subscription added: ${subscription.email}`);
    res.status(201).json({ success: true, subscription });
  } catch (err: any) {
    console.error('❌ Error adding subscription:', err.message);
    res.status(500).json({ error: 'Failed to add subscription' });
  }
});

// Remove a subscriber email
router.delete('/remove/:email', ensureAdminAuthenticated, async (req: Request, res: Response): Promise<void> => {
  const { email } = req.params;
  console.log(`📝 Removing subscriber email: ${email}`);

  try {
    const subscription = await Subscription.findOneAndDelete({ email: email.toLowerCase().trim() });
    if (!subscription) {
      console.error(`❌ Subscription not found: ${email}`);
      res.status(404).json({ error: 'Subscription not found' });
      return;
    }
    console.log(`✅ Subscription removed: ${email}`);
    res.json({ success: true });
  } catch (err: any) {
    console.error('❌ Error removing subscription:', err.message);
    res.status(500).json({ error: 'Failed to remove subscription' });
  }
});

// List all subscriptions
router.get('/list', ensureAdminAuthenticated, async (req: Request, res: Response): Promise<void> => {
  console.log('📝 Fetching subscription list');
  try {
    const subscriptions = await Subscription.find().select('email createdAt');
    res.json(subscriptions);
  } catch (err: any) {
    console.error('❌ Error fetching subscriptions:', err.message);
    res.status(500).json({ error: 'Failed to fetch subscriptions' });
  }
});

export default router;