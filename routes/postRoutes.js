import express from 'express';
import { addOrUpdatePersonAndWork } from '../controllers/post.js'; // Adjust the path as necessary

import { verifyToken } from '../middleware/auth.js';
import { authorizeAdmin } from '../middleware/response-handler.js';
import { upload } from '../middleware/upload.js';
import {
  getAllPersons,
  displayPersonData,
  displayPersonDetails,
} from '../controllers/post.js';
import { getAllNews, getNewsById, addNews } from '../controllers/news.js';

const router = express.Router();

router
  .route('/')
  .post(verifyToken, authorizeAdmin, upload, addOrUpdatePersonAndWork);
/*   .put(verifyToken, updateUser); */
router.post('/news', verifyToken, authorizeAdmin, upload, addNews);

// Route to get all news items
router.get('/news', getAllNews);

router.get('/persons', getAllPersons);
router.get('/news/:id', getNewsById);
// Route to display details of a specific person
router.get('/persons/details/:id', displayPersonDetails);

// Route to display detailed data of a specific person
router.get('/persons/data/:id', displayPersonData);

export default router;
