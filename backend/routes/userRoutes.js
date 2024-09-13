import express from "express";
import {imageUpload} from '../utils/multer.js'

// Import user-related controllers
import {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
} from "../controllers/userController.js";

// Import middleware
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Set up Cloudinary storage for multer


// Define routes
router.post("/", imageUpload, registerUser);
router.post("/auth", authUser);
router.post("/logout", logoutUser);
router
  .route("/profile")
  .get(protect, getUserProfile)
  .put(protect, imageUpload, updateUserProfile);

export default router;
