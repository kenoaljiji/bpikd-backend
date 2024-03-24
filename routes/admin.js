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
  .route('/user')
  .post(verifyToken, authorizeAdmin, register) // Register a new user
  .get(verifyToken, getUser)
  .put(verifyToken, updateUser);

router.route('/user/login').post(login); // User login
router.get('/user/list', verifyToken, authorizeAdmin, getAllUsers);

router
  .route('/delete-multiply')
  .delete(verifyToken, authorizeAdmin, deleteMultipleUsers); // User login

// Parameterized routes for user operations
router.get('/user/:userId', verifyToken, getUserById);
router.put('/user/:userId', verifyToken, updateUser);
router.delete('/user/:userId', verifyToken, authorizeAdmin, deleteUser);
// Export the router using ES6 default export
export default router;
