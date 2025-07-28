import asyncHandler from "../middleware/asyncHandler.js";
import User from "../models/userModel.js";
import generateToken from "../utils/generateToken.js";

// @desc auth user & get token
// @route POST /api/users/login
// @access Public

const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (user && (await user.matchPassword(password))) {
    generateToken(res, user._id);

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      // Include currentWorkoutIndex and lastCompletedWorkout in the response
      currentWorkoutIndex: user.currentWorkoutIndex,
      lastCompletedWorkout: user.lastCompletedWorkout,
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

// @desc register user
// @route POST /api/users
// @access Public

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }
  const user = await User.create({
    name,
    email,
    password,
    // Initialize these fields for new users
    currentWorkoutIndex: 0,
    lastCompletedWorkout: null,
  });
  if (user) {
    generateToken(res, user._id);

    res.status(201).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      // Include currentWorkoutIndex and lastCompletedWorkout in the response
      currentWorkoutIndex: user.currentWorkoutIndex,
      lastCompletedWorkout: user.lastCompletedWorkout,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

// @desc logout user / clear cookie
// @route POST /api/users/logout
// @access private

const logoutUser = asyncHandler(async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: "Logged out successfully" });
});

// @desc get user profile
// @route GET /api/users/profile
// @access private (changed from public to private for consistency with req.user._id)

const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id); // Uses ID from auth middleware
  if (user) {
    res.status(200).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      currentWorkoutIndex: user.currentWorkoutIndex, // Include current workout index
      lastCompletedWorkout: user.lastCompletedWorkout, // Include last completed workout
    });
  } else {
    res.status(404);
    throw new Error("User not found.");
  }
});

// @desc update user profile
// @route PUT /api/users/profile
// @access private

const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id); // Uses ID from auth middleware

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    if (req.body.password) {
      user.password = req.body.password;
    }
    // Allow updating currentWorkoutIndex and lastCompletedWorkout
    if (req.body.currentWorkoutIndex !== undefined) {
      user.currentWorkoutIndex = req.body.currentWorkoutIndex;
    }
    if (req.body.lastCompletedWorkout !== undefined) {
      user.lastCompletedWorkout = req.body.lastCompletedWorkout;
    }

    const updatedUser = await user.save();
    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      currentWorkoutIndex: updatedUser.currentWorkoutIndex, // Return updated index
      lastCompletedWorkout: updatedUser.lastCompletedWorkout, // Return updated last workout
    });
  } else {
    res.status(404);
    throw new Error(" User not found.");
  }
});

// admin

// @desc get users
// @route GET /api/users/
// @access private/admin

const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});
  res.status(200).json(users);
});

// @desc get user by ID
// @route GET /api/users/:id
// @access private/admin

const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");

  if (user) {
    res.status(200).json(user);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc delete users
// @route DELETE /api/users/:id
// @access private/admin

const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    if (user.isAdmin) {
      res.status(400);
      throw new Error("Cannot delete admin user");
    }
    await User.deleteOne({ _id: user._id });
    res.status(200).json({ message: "User deleted successfully" });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc update users (admin only)
// @route PUT /api/users/:id
// @access private/admin

const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id); // This is the line causing the error if req.params.id is undefined

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.isAdmin = Boolean(req.body.isAdmin);

    // This admin route should not directly handle user's personal workout progress.
    // That's handled by updateUserProfile.
    // If admin needs to reset, they would do it via a specific admin action.

    const updatedUser = await user.save();

    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc get emails of users
// @route GET /api/users/emails
// @access private/admin
const getEmails = asyncHandler(async (req, res) => {
  const users = await User.find({});
  const emails = users.map((user) => user.email); // Collect only emails
  res.status(200).json(emails);
});

// Removed updateUserWorkoutProgress and getUserWorkoutProgress as their functionality
// is now integrated into updateUserProfile and getUserProfile for the current user.
// Admin-specific updates would go into the updateUser function.

export {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUser, // This is for admin to update any user by ID
  updateUserProfile, // This is for a user to update their own profile
  getUsers,
  deleteUser,
  getUserById,
  getEmails,
  // Removed: updateUserWorkoutProgress,
  // Removed: getUserWorkoutProgress,
};
