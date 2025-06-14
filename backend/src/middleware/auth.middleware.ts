// import { Request, Response, NextFunction, RequestHandler } from "express";

// export const ensureAdminAuthenticated: RequestHandler = (
//   req,
//   res,
//   next,
// ): void => {
//   if (req.session && req.session.isAdmin) {
//     next();
//     return;
//   }
//   res.status(401).json({ error: "Unauthorized" });
// };

import { Request, Response, NextFunction, RequestHandler } from 'express';
import { Organization } from '../models/Organization';
import { Subscription } from '../models/Subscription';

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
  next,
): Promise<void> => {
  if (!req.isAuthenticated()) {
    console.error('❌ User not authenticated with Google');
    res.status(401).json({ error: 'Not authenticated with Google' });
    return;
  }

  // const userEmail = (req.user as any)?.email?.trim().toLowerCase();
  // if (!userEmail) {
  //   console.error('❌ No email found for user');
  //   res.status(401).json({ error: 'User email not found' });
  //   return;
  // }

  const userEmail = (req.user as any)?.email?.trim();
  if (!userEmail || !userEmail.includes('@')) {
    console.error('❌ Invalid or missing user email');
    res.status(401).json({ error: 'User email not found or invalid' });
    return;
  }

  try {
    const organizations = await Organization.find();
    const subscription = await Subscription.findOne({ email: userEmail.toLowerCase().trim() });
    if (organizations.length === 0 && !subscription) {
      console.log('✅ No organizations, allowing chat access');
      next();
      return;
    }

//     const userDomain = userEmail.split('@')[1].toLowerCase().trim();
//     const allowed = organizations.some((org) =>
//       org.domains.map((d) => d.toLowerCase().trim()).includes(userDomain),
//     );

//     if (allowed) {
//       console.log(`✅ User ${userEmail} allowed for chat (domain: ${userDomain})`);
//       next();
//     } else {
//       console.error(`❌ User ${userEmail} not allowed (domain: ${userDomain})`);
//       res.status(403).json({ error: 'Email domain not authorized for chat' });
//     }
//   } catch (err: any) {
//     console.error('❌ Error checking organization domains:', err.message);
//     res.status(500).json({ error: 'Failed to verify access' });
//   }
// };

    const userDomain = userEmail.split('@')[1].toLowerCase().trim();
    const isOrganizer = organizations.some((org) =>
      org.organizers.map((o) => o.toLowerCase().trim()).includes(userEmail.toLowerCase()),
    );

    const isDomainAllowed = organizations.some((org) =>
      org.domains.map((d) => d.toLowerCase().trim()).includes(userDomain),
    );

    const hasSubscription = !!subscription;

    if (isOrganizer || isDomainAllowed || hasSubscription) {
      console.log(`✅ User ${userEmail} allowed for chat (organizer: ${isOrganizer}, domain: ${userDomain}, subscription: ${hasSubscription})`);
      next();
    } else {
      console.error(`❌ User ${userEmail} not allowed (domain: ${userDomain})`);
      res.status(403).json({ error: 'Email domain or user not authorized for chat' });
    }
  } catch (err: any) {
    console.error('❌ Error checking organization domains:', err.message);
    res.status(500).json({ error: 'Failed to verify access' });
  }
};
