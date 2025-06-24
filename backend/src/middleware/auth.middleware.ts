import { Request, Response, NextFunction, RequestHandler } from 'express';
import { Organization } from '../models/Organization';
import { Subscription } from '../models/Subscription';
import { User, IUser } from '../models/user';

export const ensureAdminAuthenticated: RequestHandler = (
  req,
  res,
  next,
): void => {
  if (req.session && req.session.isAdmin) {
    next();
    return;
  }
  res.status(401).json({ error: 'Unauthorized' });
};

export const ensureGoogleAuthenticated: RequestHandler = (
  req,
  res,
  next,
): void => {
  if (req.isAuthenticated()) {
    next();
    return;
  }
  res.status(401).json({ error: 'Not authenticated with Google' });
};

export const restrictChatToOrgDomains: RequestHandler = async (
  req,
  res,
  next
): Promise<void> => {
  // 1. Must be authenticated
  if (!req.isAuthenticated?.()) {
    console.error('❌ User not authenticated');
    res.status(401).json({ error: 'Not authenticated' });
    return;
  }

  const userObj = req.user as IUser;
  const userEmail = userObj.email?.toLowerCase()?.trim();
  if (!userEmail || !userEmail.includes('@')) {
    console.error('❌ Invalid user email');
    res.status(401).json({ error: 'Invalid user email' });
    return;
  }

  try {
    // Load orgs, subscription status, and fresh user doc
    const [orgs, subscription, fullUser] = await Promise.all([
      Organization.find().lean(),
      Subscription.findOne({ email: userEmail }),
      User.findById(userObj._id),
    ]);

    if (!fullUser) {
      console.error('❌ User record not found in DB');
      res.status(500).json({ error: 'User record not found' });
      return;
    }

    const domain = userEmail.split('@')[1];
    const isOrgMember = orgs.some((org) =>
      org.organizers.map((e) => e.toLowerCase().trim()).includes(userEmail)
    );
    const isDomainAllowed = orgs.some((org) =>
      org.domains.map((d) => d.toLowerCase().trim()).includes(domain)
    );
    const hasPaid = Boolean(subscription) || fullUser.isSubscribed;

    // Unlimited access for org members or paid subscribers
    if (isOrgMember || isDomainAllowed || hasPaid) {
      next();
      return;
    }

    // Trial access: check and decrement credits
    if (fullUser.chatCredits > 0) {
      fullUser.chatCredits -= 1;
      await fullUser.save();
      console.log(
        `🔋 Trial chat: ${userEmail} has ${fullUser.chatCredits} credits left`
      );
      next();
      return;
    }

    // No credits left
    console.error(`❌ Trial expired for ${userEmail}`);
    res
      .status(403)
      .json({ error: 'Your free trial is over. Please subscribe.' });
    return;
  } catch (err: any) {
    console.error('❌ Chat access check failed:', err);
    res.status(500).json({ error: 'Failed to verify access' });
    return;
  }
};
