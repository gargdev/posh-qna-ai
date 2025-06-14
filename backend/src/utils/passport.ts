import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { User, IUser } from '../models/user';

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      callbackURL: process.env.GOOGLE_REDIRECT_URI as string,
    },
    async (accessToken, refreshToken, profile, done) => {
      console.log('🔑 Processing Google OAuth profile');
      try {
        let user = await User.findOne({ googleId: profile.id });
        if (!user) {
          user = await User.create({
            googleId: profile.id,
            displayName: profile.displayName,
            email: profile.emails?.[0].value,
          });
          console.log('🆕 Created new user:', user.email);
        } else {
          console.log('✅ Existing user found:', user.email);
        }
        return done(null, user);
      } catch (err) {
        console.error('❌ Error processing Google profile:', err);
        return done(err as Error, false);
      }
    }
  )
);

passport.serializeUser((user: any, done) => {
  console.log('🔄 Serializing user:', user.id);
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
  console.log('🔄 Deserializing user:', id);
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    console.error('❌ Deserialization error:', err);
    done(err, null);
  }
});