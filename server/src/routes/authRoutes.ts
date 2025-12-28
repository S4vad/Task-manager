import express from 'express';
import { register, login, logout, me } from '../controller/authController';
import { authenticate } from '../middleware/authMiddleware';


const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post("/logout", logout);
router.get("/me", authenticate, me);

export default router;