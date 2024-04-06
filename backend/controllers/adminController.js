import asyncHandler from "express-async-handler";
import Admin from "../models/adminModel.js";
import User from "../models/userModels.js";

import generateToken from "../utils/genetateToken.js";


// @desc Auth Admin/set token
// route POST /api/admins/auth
// @ access Pubilc
const authAdmin = asyncHandler(async (req, res) => {


  const { email, password } = req.body;

  console.log(email, password);
  const admin = await Admin.findOne({ email });
  if (admin && (await admin.matchPassword(password))) {
    generateToken(res, admin._id);
    res.status(201).json({
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      image: admin.image,
    });
  } else {
    res.status(400);
    throw new Error("invalid Email and Password");
  }
});

const userList = asyncHandler(async (req, res) => {
  const { page = 1, limit = 4, key = "" } = req.query;
console.log(page,key);
  const users = await User.find({
    name: { $regex: new RegExp(`^${key}`, "i") },
  })
    .sort({ updatedAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
   
  const totalUser = await User.countDocuments();
  const lastPage = Math.ceil(totalUser / limit);
  res.status(200).json({
    page,
    users,
    lastPage,
  });
});


// @desc Auth user/a new user
// route POST /api/users/register
// @ access Pubilc

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const image = req.file.filename;
  console.log(name, email, password, image);
  const userExist = await User.findOne({ email });
  if (userExist) {
    res.status(400);
    throw new Error("user Already Exist");
  }

  const user = await User.create({
    name,
    email,
    password,
    image,
  });

  if (user) {
    generateToken(res, user._id);
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      image: user.image,
    });
  } else {
    res.status(400);
    throw new Error("invalid user Data");
  }
});

// @desc Auth Admin/logout Admin
// route POST /api/Admins/logout
// @ access Pubilc
const logoutAdmin = asyncHandler(async (req, res) => {
  res.cookie("Jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  console.log("Admin Logged Out");
  res.status(200).json({ message: " Admin Logged Out" });
});

// @desc get AdminProfile
// route get /api/Admins/profile
// @ access private
const getAdminProfile = asyncHandler(async (req, res) => {
  const Admin = {
    _id: req.Admin._id,
    name: req.Admin.name,
    email: req.Admin.email,
  };
  res.status(200).json({ Admin });
});

// @desc Update AdminProfile
// route PUT /api/Admins/profile
// @ access private
const updateAdminProfile = asyncHandler(async (req, res) => {
  const { _id, name, email } = req.body
  const admin = await User.findById(_id);
  if (admin) {
    console.log({ _id, name, email });
    admin.name = req.body.name || admin.name;
    admin.email = req.body.email || admin.email;
    if (req.file) {
      admin.image = req.file.filename || admin.image;
    }
    if (req.body.password) {
      admin.password = req.body.password;
    }

    const updateAdmin = await admin.save();

    res.status(200).json({
      _id: updateAdmin._id,
      name: updateAdmin.name,
      email: updateAdmin.email,
      image: updateAdmin.image,
    });
  } else {
    res.status(404);
    throw new Error("Admin Not Found");
  }
  res.status(200).json({ message: "update  Admin profile" });
});

const deleteUser = asyncHandler(async (req, res) => {
  const userId = req.body.id; 
  console.log('hello',userId);
  try {

    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
     
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {

    res.status(500).json({ message: "Internal server error", error: error.message });
  }
});


export { authAdmin, registerUser,logoutAdmin, userList,deleteUser, getAdminProfile, updateAdminProfile };
