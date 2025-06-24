import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import bcrypt from 'bcryptjs';
import { User } from '../models/user';
import { Organization } from '../models/Organization';
import { Subscription } from '../models/Subscription';

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err as any);
  }
});

// --- Local Strategy ---
passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
}, async (email, password, done) => {
  try {
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user || !user.password) {
      return done(null, false, { message: 'Invalid credentials' });
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return done(null, false, { message: 'Invalid credentials' });
    }

    // now check org/subscription
    const sub = await Subscription.findOne({ email: user.email });
    const orgs = await Organization.find();
    const domain = user.email.split('@')[1];
    const isOrgMember = orgs.some(o =>
      o.organizers.includes(user.email) || o.domains.includes(domain)
    );
    const hasPaid = !!sub;

    // assign subscription & credits
    user.isSubscribed = hasPaid;
    user.chatCredits  = hasPaid ? Infinity : (user.chatCredits || 5);
    await user.save();

    done(null, user);
  } catch (err) {
    done(err as any);
  }
}));

// --- Google Strategy ---
passport.use(new GoogleStrategy({
  clientID:     process.env.GOOGLE_CLIENT_ID!,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  callbackURL:  '/api/auth/google/callback',
  passReqToCallback: true
}, async (req: any, accessToken, refreshToken, profile, done) => {
  try {
    const email = profile.emails?.[0].value.toLowerCase().trim()!;
    // find or create user
    let user = await User.findOne({ googleId: profile.id });
    if (!user) {
      user = new User({
        googleId:    profile.id,
        displayName: profile.displayName,
        email
      });
    }

    // org/subscription check
    const sub       = await Subscription.findOne({ email });
    const orgs      = await Organization.find();
    const domain    = email.split('@')[1];
    const isOrgMem  = orgs.some(o =>
      o.organizers.includes(email) || o.domains.includes(domain)
    );
    const hasPaid   = !!sub;

    user.isSubscribed = hasPaid;
    user.chatCredits  = hasPaid ? Infinity : (user.chatCredits || 5);
    await user.save();

    done(null, user);
  } catch (err) {
    done(err as any);
  }
}));
