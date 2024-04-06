import asyncHandler from "express-async-handler";
import User from "../models/userModels.js";
import generateToken from "../utils/genetateToken.js";

// @desc Auth user/set token
// route POST /api/users/auth
// @ access Pubilc
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  console.log("user loggined");
  const user = await User.findOne({ email });
  if (user && (await user.matchPassword(password))) {
    generateToken(res, user._id);
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      image: user.image,
    });
  } else {
    res.status(400);
    throw new Error("invalid Email and Password");
  }
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

// @desc Auth user/logout user
// route POST /api/users/logout
// @ access Pubilc
const logoutUser = asyncHandler(async (req, res) => {
  res.cookie("Jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: " User Logged Out" });
});

// @desc get userProfile
// route get /api/users/profile
// @ access private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = {
    _id: req.user._id,
    name: req.user.name,
    email: req.user.email,
  };
  res.status(200).json({ user });
});

// @desc Update userProfile
// route PUT /api/users/profile
// @ access private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
  if (req.file) {
    user.image = req.file.filename|| user.image
  }
    if (req.body.password) {
      user.password = req.body.password;
    }

    const updateUser = await user.save();

    res.status(200).json({
      _id: updateUser._id,
      name: updateUser.name,
      email: updateUser.email,
      image: updateUser.image,
    });
  } else {
    res.status(404);
    throw new Error("user Not Found");
  }
  res.status(200).json({ message: "update  User profile" });
});

export {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
};
