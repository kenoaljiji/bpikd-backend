import express from 'express';

import {
  getAllSortedItems,
  updateOrCreateSortItems,
} from '../controllers/sortItems.js';

const router = express.Router();

router.get('/', getAllSortedItems);
router.put('/', updateOrCreateSortItems);

export default router;
