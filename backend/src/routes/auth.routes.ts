import { Router } from 'express';
import passport from 'passport';
import { googleAuth, googleAuthCallback, getCurrentUser, logout } from '../controllers/auth.controller';

const router = Router();

console.log("🔗 Setting up Google OAuth routes...");
router.get('/google', googleAuth);
router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: 'http://localhost:5173' }),
  (req, res, next) => {
	Promise.resolve(googleAuthCallback(req, res)).catch(next);
  }
);
router.get('/user', getCurrentUser);
router.get('/logout', logout);

export default router;

