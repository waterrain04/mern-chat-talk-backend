import express from 'express'
import protect from '../middleware/authMiddleware.js';
import {
  registerUser,
  authUser,
  getAllUsers
} from '../controllers/userControllers.js'

const router = express.Router();

router.post('/', registerUser);
router.post('/login', authUser);
router.get('/',protect, getAllUsers);


export default router;