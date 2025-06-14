import { Router, Request, Response } from 'express';
import { ensureAdminAuthenticated } from '../middleware/auth.middleware';
import { Subscription } from '../models/Subscription';
import { parseSubscribersCsv } from '../services/csv.service'; // New import
import { Readable } from 'stream';

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

//Upload CSV with subscriber emails
router.post('/upload-csv', ensureAdminAuthenticated, async (req: Request, res: Response): Promise<void> => {
  console.log('📂 Received CSV upload request');

  if (
    !req.files ||
    (Array.isArray(req.files) && req.files.length === 0) ||
    (typeof req.files === 'object' && !Array.isArray(req.files) && !('csvFile' in req.files))
  ) {
    console.error('❌ No file uploaded');
    res.status(400).json({ error: 'CSV file is required' });
    return;
  }

  let csvFile: any;
  if (Array.isArray(req.files)) {
    // Handle the unlikely case where req.files is an array
    csvFile = req.files[0];
  } else {
    // req.files is an object with field names as keys
    csvFile = Array.isArray(req.files.csvFile) ? req.files.csvFile[0] : req.files.csvFile;
  }

  if (csvFile.mimetype !== 'text/csv' && !csvFile.name.toLowerCase().endsWith('.csv')) {
    console.error('❌ Invalid file type');
    res.status(400).json({ error: 'Only CSV files are allowed' });
    return;
  }

  try {
    const fileStream = Readable.from(csvFile.data);
    const result = await parseSubscribersCsv(fileStream);

    if (result.errors.length > 0) {
      console.error('❌ CSV processing errors:', result.errors);
      res.status(400).json({ error: 'Invalid CSV data', details: result.errors });
      return;
    }

    const validEmails = result.emails;
    const addedEmails: string[] = [];

    for (const email of validEmails) {
      const existingSub = await Subscription.findOne({ email: email.toLowerCase().trim() });
      if (!existingSub) {
        await Subscription.create({ email: email.toLowerCase().trim() });
        addedEmails.push(email);
      }
    }

    console.log(`✅ Added ${addedEmails.length} new subscriptions`);
    res.json({
      success: true,
      message: `Added ${addedEmails.length} new subscriptions`,
      addedEmails,
    });
  } catch (err: any) {
    console.error('❌ Error processing CSV:', err.message);
    res.status(500).json({ error: 'Failed to process CSV file' });
  }
});

export default router;