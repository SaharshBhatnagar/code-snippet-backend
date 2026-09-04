import express from 'express';
import { verifyAuth } from '../middleware/authmiddleware.js';
import { registerUser, loginUser, logoutUser, verifySession } from '../controllers/authController.js';

const router = express.Router();

router.get('/verify', verifyAuth, verifySession);
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);

export default router;