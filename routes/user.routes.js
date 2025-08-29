import express from 'express';
import { login, refreshToken, signup } from '../controllers/user.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/refresh', refreshToken);

router.get('/profile', authMiddleware, (req, res) => {
  res.status(200).json({ message: 'Profile data', user: req.user });
});

export { router as userRouter };
