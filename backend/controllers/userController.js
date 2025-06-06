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
  });
  if (user) {
    generateToken(res, user._id);

    res.status(201).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
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
// @access public

const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    res.status(200).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
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
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    if (req.body.password) {
      user.password = req.body.password;
    }
    const updatedUser = await user.save();
    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
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

// @desc update users
// @route PUT /api/users/:id
// @access private/admin

const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.isAdmin = Boolean(req.body.isAdmin);

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
// @desc    Atualizar o progresso do treino do usuário
// @route   PUT /api/users/:id/workoutprogress
// @access  Private
const updateUserWorkoutProgress = asyncHandler(async (req, res) => {
  const userId = req.params.id;
  const { currentExerciseIndex } = req.body;

  console.log('Atualizando progresso para o usuário:', userId);
  console.log('Novo índice do exercício:', currentExerciseIndex);

  const user = await User.findById(userId);

  if (user) {
    user.currentExerciseIndex = currentExerciseIndex;
    const updatedUser = await user.save();
    console.log('Progresso salvo no banco de dados:', updatedUser.currentExerciseIndex);
    res.json({ message: 'Progresso do treino atualizado com sucesso', currentExerciseIndex: updatedUser.currentExerciseIndex });
  } else {
    res.status(404);
    throw new Error('Usuário não encontrado');
  }
});

// @desc    Obter o progresso do treino do usuário
// @route   GET /api/users/:id/workoutprogress
// @access  Private
const getUserWorkoutProgress = asyncHandler(async (req, res) => {
  const userId = req.params.id;

  const user = await User.findById(userId);

  if (user) {
    res.json({ currentExerciseIndex: user.currentExerciseIndex });
  } else {
    res.status(404);
    throw new Error('Usuário não encontrado');
  }
});

export {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUser,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  getEmails,
  updateUserWorkoutProgress,
  getUserWorkoutProgress,
};
