import { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import { Organization } from '../models/Organization';
import { Subscription } from '../models/Subscription';

export const googleAuth = (req: Request, res: Response, next: NextFunction) => {
  console.log('🔐 Initiating Google OAuth flow');
  passport.authenticate('google', {
     scope: ['profile', 'email'],
     prompt: 'select_account' ,
     state: req.query.redirect ? encodeURIComponent(req.query.redirect as string) : undefined,
    })(req, res, next);
};

export const googleAuthCallback = async (req: Request, res: Response) => {
  console.log('🔐 Google OAuth callback processed');
  const user = req.user as any;
  console.log(`🔑 Processing Google OAuth profile for ${user?.email}`);
  // Validate email domain
  try {
    const organizations = await Organization.find();
    const subscription = await Subscription.findOne({ email: user.email.toLowerCase().trim() });
    
    if (organizations.length === 0 && !subscription) {
      console.log('✅ No organizations, allowing login');
    } else {
      const userEmail = user.email.toLowerCase().trim();
      const userDomain = userEmail.split('@')[1];
      const isOrganizer = organizations.some((org) =>
        org.organizers.map((o) => o.toLowerCase().trim()).includes(userEmail),
      );
      const isDomainAllowed = organizations.some((org) =>
        org.domains.map((d) => d.toLowerCase().trim()).includes(userDomain),
      );

      const hasSubscription = !!subscription;

      if (!isOrganizer && !isDomainAllowed && !hasSubscription) {
        console.error(`❌ User ${userEmail} not allowed (domain: ${userDomain})`);
        await req.logout(() => {});
        return res.status(403).json({ error: 'Email domain or user not authorized' });
      }
      console.log(`✅ User ${userEmail} allowed (organizer: ${isOrganizer}, domain: ${userDomain})`);
    }
  } catch (err: any) {
    console.error('❌ Error checking organization domains:', err.message);
    await req.logout(() => {});
    return res.status(500).json({ error: 'Failed to verify access' });
  }

  const redirect = req.query.state
    ? decodeURIComponent(req.query.state as string)
    : 'http://localhost:5173';
  res.redirect(redirect);
};


export const getCurrentUser = (req: Request, res: Response) => {
  console.log('🔍 Fetching current user', req.user || "No user");
  if (req.user) {
    res.json({ user: req.user });
  } else {
    res.json({ user: null });
  }
};

// export const logout = (req: Request, res: Response) => {
//   console.log('🔓 Logging out user');
//   req.logout((err) => {
//     if (err) {
//       console.error('❌ Logout error:', err);
//       return res.status(500).json({ error: 'Logout failed' });
//     }
//     res.redirect('http://localhost:5173');
//   });
// };

export const logout = (req: Request, res: Response) => {
  console.log('🔓 Logging out user');
  req.logout((err) => {
    if (err) {
      console.error('❌ Logout error:', err);
      return res.status(500).json({ error: 'Logout failed' });
    }
    // Destroy the session
    req.session.destroy((err) => {
      if (err) {
        console.error('❌ Session destroy error:', err);
        return res.status(500).json({ error: 'Session destroy failed' });
      }
      console.log('✅ Session destroyed');
      // Clear the connect.sid cookie
      res.clearCookie('connect.sid', {
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
      });
      // Return JSON instead of redirect to avoid Axios issues
      res.json({ success: true });
    });
  });
};