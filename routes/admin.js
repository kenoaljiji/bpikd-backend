// Import Express and other required modules using ES6 syntax
import express from "express";
import {
  login,
  register,
  getUser,
  updateUser,
  deleteUser,
  getAllUsers,
} from "../controllers/admin.js";
import { verifyToken } from "../middleware/auth.js";
import { authorizeAdmin } from "../middleware/response-handler.js";

const router = express.Router();

// Setup routes
router
  .route("/")
  .post(register)
  .get(verifyToken, getUser)
  .put(verifyToken, updateUser)
  .delete(verifyToken, deleteUser);

router.route("/login").post(login);

// Secure the route so only admin users can fetch all users
router.route("/all").get(verifyToken, getAllUsers, authorizeAdmin);

// Export the router using ES6 default export
export default router;
