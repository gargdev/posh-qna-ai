// // import { Router } from 'express';
// // import passport from 'passport';
// // import { googleAuth, googleAuthCallback, getCurrentUser, logout } from '../controllers/auth.controller';

// // const router = Router();

// // console.log("🔗 Setting up Google OAuth routes...");
// // router.get('/google', googleAuth);
// // router.get(
// //   '/google/callback',
// //   passport.authenticate('google', { failureRedirect: 'http://localhost:5173' }),
// //   (req, res, next) => {
// // 	Promise.resolve(googleAuthCallback(req, res)).catch(next);
// //   }
// // );
// // router.get('/user', getCurrentUser);
// // router.get('/logout', logout);

// // export default router;

// import { Router } from 'express';
// import {
//   localLogin,
//   googleAuth,
//   googleCallback,
//   googleRedirect,
//   getCurrentUser,
//   logout
// } from '../controllers/auth.controller';

// const router = Router();

// router.post('/login',          localLogin);
// router.get('/logout',          logout);
// router.get('/user',            getCurrentUser);

// // Google OAuth
// router.get('/google',          googleAuth);
// router.get('/google/callback', googleCallback, googleRedirect);

// export default router;

// src/routes/auth.routes.ts
import { Router } from 'express';
import {
  localLogin,
  googleAuth,
  googleCallback,
  googleRedirect,
  getCurrentUser,
  logout,
} from '../controllers/auth.controller';

const router = Router();

// Local
router.post('/login', localLogin);

// Session
router.get('/logout', logout);
router.get('/user', getCurrentUser);

// Google OAuth
router.get('/google', googleAuth);
router.get('/google/callback', googleCallback, googleRedirect);

export default router;
