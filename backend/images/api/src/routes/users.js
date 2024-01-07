const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUserById,
  deleteUser,
  deleteAllUsers,
} = require("../controllers/user");

/**
 * Register a new user.
 * @name Register User
 * @route {POST} /api/users/register
 * @param {Object} User details - e.g., username, email, password.
 * @returns {Object} Details of the newly registered user, without password for security.
 */
router.post("/register", registerUser);

/**
 * Authenticate and log in a user.
 * @name Login User
 * @route {POST} /api/users/login
 * @param {Object} User credentials - e.g., email, password.
 * @returns {Object} user details upon successful login.
 */
router.post("/login", loginUser);

/**
 * Retrieve details of a specific user by their ID.
 * @name Get User by ID
 * @route {GET} /api/users/:userId
 * @param {Object} User details - e.g., username, email, password.
 * @returns {Object} Details of the requested user.
 */
router.get("/:userId", getUserById);

/**
 * Delete a user by their ID.
 * @name Delete User
 * @route {DELETE} /api/users/:userId
 * @param {string} userId - ID of the user to delete.
 * @returns {string} Confirmation message.
 */
router.delete("/:userId", deleteUser);

/**
 * Delete all users from the database.
 * @name Delete All users
 * @route {DELETE} /api/users
 * @returns {string} Confirmation message.
 */
router.delete("/", deleteAllUsers);

module.exports = router;
