import express from 'express';

import { verifyToken } from '../middleware/auth.js';
import { authorizeAdmin } from '../middleware/response-handler.js';

import {
  getAllSortedItems,
  updateOrCreateSortItems,
} from '../controllers/sortItems.js';

const router = express.Router();

router.get('/', getAllSortedItems);
router.put('/', updateOrCreateSortItems);

export default router;
