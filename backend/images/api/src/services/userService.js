const { v4: uuidv4 } = require("uuid");
const { Pool } = require("pg");
const bcrypt = require("bcryptjs");
const knex = require("knex")(require("../db/knexfile"));

/**
 * Create a new user.
 * @param {Object} userData - Object containing user details: username, email, password.
 * @returns {Promise<Object>} Object with the ID and username of the newly created user.
 * @throws {Error} Throws an error if the user already exists or an issue occurs during user creation.
 */
const createUser = async (userData) => {
  const { username, email, password } = userData;
  const randomUUID = uuidv4();

  try {
    const userExists = await knex("users").where({ email }).first();

    if (userExists) {
      throw new Error("User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await knex("users").insert({
      id: randomUUID,
      username,
      email,
      password: hashedPassword,
    });

    return { id: randomUUID, username };
  } catch (error) {
    throw error;
  }
};

/**
 * Delete a user by ID.
 * @param {string} userId - ID of the user to be deleted.
 * @returns {Promise<Object|null>} Success message if user was deleted or null if user was not found.
 * @throws {Error} Throws an error if there's an issue in deleting the user.
 */
const deleteUser = async (userId) => {
  try {
    const result = await knex("users").where({ id: userId }).del();

    if (result === 0) {
      return null; // User not found
    }

    return { message: "User deleted successfully" };
  } catch (err) {
    console.error("Error deleting user:", err);
    throw new Error("Error deleting user");
  }
};

/**
 * Get a user by their email.
 * @param {string} email - Email address of the user to be fetched.
 * @returns {Promise<Object|null>} User details if found, null if not found.
 * @throws {Error} Throws an error if there's an issue in fetching the user by email.
 */
const getUserByEmailWithPassword = async (email) => {
  try {
    const user = await knex("users").where({ email }).first();

    if (!user) {
      return null;
    }

    return {
      id: user.id,
      username: user.username,
      email: user.email,
      password: user.password, // Note: Ideally, don't return the password here for security reasons.
    };
  } catch (error) {
    throw new Error("Error fetching user by email");
  }
};

/**
 * Get a user by their ID.
 * @param {string} userId - ID of the user to be fetched.
 * @returns {Promise<Object|null>} User details if found, null if not found.
 * @throws {Error} Throws an error if there's an issue in fetching the user by ID.
 */
const getUserById = async (userId) => {
  try {
    const user = await knex("users").where({ id: userId }).first();

    if (!user) {
      return {
        status: 404, // User not found
        data: null,
      };
    } else if (user) {
      // Extract user details
      const userData = {
        id: user.id,
        username: user.username,
        email: user.email,
        // Include other user details as needed
      };
      return {
        status: 200, // Success
        data: userData,
      };
    }
  } catch (error) {
    return {
      status: 500, // Internal server error
      data: null,
    };
  }
};

/**
 * Delete all users from the database.
 * @returns {Promise<Object>} Success message confirming the deletion of all users.
 * @throws {Error} Throws an error if there's an issue in deleting all users.
 */
const deleteAllUsers = async () => {
  try {
    await knex("users").del();
    return { message: "All users deleted successfully" };
  } catch (err) {
    console.error("Error deleting all users:", err);
    throw new Error("Error deleting all users");
  }
};

module.exports = {
  createUser,
  deleteUser,
  getUserByEmailWithPassword,
  getUserById,
  deleteAllUsers,
};
