import express from 'express';
import {getCurrentUser, getAllUsers, getUserById, updateUser, deleteUser} from '../controllers/user.controller';
import { deserializeUser } from '../middleware/deserializeUser';
import { requireUser } from '../middleware/checkUser';
import { restrictTo } from '../middleware/prrmissionCheck';

const router = express.Router();
router.use(deserializeUser, requireUser);
router.get('/', restrictTo('admin'), getAllUsers);
router.get('/me', getCurrentUser);
router.get('/getUser', getUserById);
router.post('/update/user', updateUser);
router.post('/delete/user', deleteUser);

export default router;