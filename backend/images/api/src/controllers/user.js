const userService = require("../services/userService");
const validationHelpers = require("../helpers/validationHelpers");
const bcrypt = require("bcryptjs");

/**
 * Register/Create user.
 * @param {Object} req - The request object containing user details in the body.
 */
const registerUser = async (req, res) => {
  try {
    const { email, password, username } = req.body;
    // Check if all required variables are present in req.body
    if (!email || !password || !username) {
      return res
        .status(400)
        .json({ message: "Missing required fields in the request body" });
    }

    // Check if the email is valid
    if (!validationHelpers.validateTheEmail(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // Check if the password is valid
    if (!validationHelpers.validatePassword(password)) {
      return res.status(400).json({
        message:
          "Invalid password format, make sure its longer then 8 characters, and does not exist out of numbers.",
      });
    }

    // Check if the username is valid
    if (!validationHelpers.validateUsername(username)) {
      return res.status(400).json({
        message:
          "Invalid username format, make sure its longer then 6 characters, and does not exist out of numbers.",
      });
    }

    const newUser = await userService.createUser(req.body);
    res.status(200).json({ user: newUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Login user.
 * @param {Object} req - The request object containing user details in the body.
 */
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Missing required fields in the request body" });
  }
  try {
    const user = await userService.getUserByEmailWithPassword(email);

    if (!user) {
      return res
        .status(401)
        .json({ error: "User with this email doesn't exist" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: "Incorrect password" });
    }

    const userData = {
      id: user.id,
      username: user.username,
    };

    return res
      .status(200)
      .json({ message: "Login successful", user: userData });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Get a user by its ID.
 * @param {Object} req - The request object containing user details in the body.
 */
const getUserById = async (req, res) => {
  try {
    const { userId } = req.params;
    // Validate userId - Check if it matches the specific structure and if it is a string value
    if (
      !validationHelpers.validateIfString(userId) &&
      !validationHelpers.validateIfUUID(userId)
    ) {
      return res.status(400).json({ message: "Invalid userId format" });
    }

    const foundUser = await userService.getUserById(userId);

    if (foundUser.status === 500) {
      // User not found
      return res.status(404).json({ message: "User not found on id" });
    } else {
      return res.status(200).json({ user: foundUser });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/**
 * Delete a user by its ID.
 * @param {Object} req - The request object containing user details in the body.
 */
const deleteUser = async (req, res) => {
  const { userId } = req.params;
  try {
    const deletedUser = await userService.deleteUser(userId);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    return res.status(500).send(err);
  }
};

/**
 * Delete all users.
 * @param {Object} req - The request object containing user details in the body.
 */
const deleteAllUsers = async (req, res) => {
  try {
    const result = await userService.deleteAllUsers();

    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).send(err);
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserById,
  deleteUser,
  deleteAllUsers,
};
