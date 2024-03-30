import express from 'express';
import { addOrUpdatePersonAndWork } from '../controllers/post.js'; // Adjust the path as necessary

import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/', verifyToken, addOrUpdatePersonAndWork);

export default router;
