import express from 'express';
import {
  login,
  register,
  getUser,
  updateUser,
  deleteUser,
  getAllUsers,
  deleteMultipleUsers,
  getUserById,
} from '../controllers/admin.js';
import { verifyToken } from '../middleware/auth.js';
import { authorizeAdmin } from '../middleware/response-handler.js'; // Assuming this is authorization middleware

const router = express.Router();

// Setup routes
router
  .route('/')
  .post(verifyToken, authorizeAdmin, register) // Register a new user
  .get(verifyToken, getUser)
  .put(verifyToken, updateUser);

router.route('/login').post(login); // User login
router.get('/list', verifyToken, authorizeAdmin, getAllUsers);

// First, define specific routes:
router.get('/list', verifyToken, authorizeAdmin, getAllUsers);

router.delete(
  '/delete-multiply',
  verifyToken,
  authorizeAdmin,
  deleteMultipleUsers
);

// Parameterized routes for user operations
router.get('/:userId', verifyToken, getUserById);
router.put('/:userId', verifyToken, updateUser);
router.delete('/:userId', verifyToken, authorizeAdmin, deleteUser);
// Export the router using ES6 default export
export default router;
