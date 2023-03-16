import express from 'express';
import {getCurrentUser, getAllUsers} from '../controllers/user.controller';
import { deserializeUser } from '../middleware/deserializeUser';
import { requireUser } from '../middleware/checkUser';
import { restrictTo } from '../middleware/prrmissionCheck';

const router = express.Router();
router.use(deserializeUser, requireUser);
router.get('/', restrictTo('admin'), getAllUsers);
router.get('/me', getCurrentUser);

export default router;