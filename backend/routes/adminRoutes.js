import { fileURLToPath } from "url";
import express from "express";
import path from "path";
const router = express.Router();
import {
  authAdmin,
  logoutAdmin,
  userList,
  registerUser,
  getAdminProfile,
  deleteUser,
  updateAdminProfile,
} from "../controllers/adminController.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
import { protect } from "../middleware/authMiddlewareAdmin.js";
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


router.post("/auth", authAdmin);
router.post("/logout", logoutAdmin);
router.delete('/deleteuser',protect,deleteUser)
router.get('/user-list',protect, userList)
router.post("/adduser", upload.single("image"), registerUser);
router.post("/edituser", upload.single("image"),protect, updateAdminProfile);


export default router;
