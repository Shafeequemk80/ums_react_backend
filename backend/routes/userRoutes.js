import { fileURLToPath } from "url";
import express, { Router } from "express";
import path from "path";
const router = express.Router();
import {
  authUser,
  registerUser,
  logoutUser,
 
  getUserProfile,
  updateUserProfile,
} from "../controllers/userController.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
import { protect } from "../middleware/authMiddleware.js";
import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log(file);
    cb(null, path.join(__dirname, "../public/userImages"));
  },
  filename: function (req, file, cb) {
    const name = Date.now() + "-" + file.originalname;
    cb(null, name);
  },
});

const upload = multer({ storage: storage });

router.post("/", upload.single("image"), registerUser);
router.post("/auth", authUser);
router.post("/logout", logoutUser);
router
  .route("/profile")
  .get(protect, getUserProfile)
  .put(protect, upload.single("image"), updateUserProfile);


export default router;
