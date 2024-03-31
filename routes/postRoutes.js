import express from 'express';
import { addOrUpdatePersonAndWork } from '../controllers/post.js'; // Adjust the path as necessary

import { verifyToken } from '../middleware/auth.js';
import { authorizeAdmin } from '../middleware/response-handler.js';

const router = express.Router();

router.post('/', verifyToken, authorizeAdmin, addOrUpdatePersonAndWork);

export default router;
