const { v4: uuidv4 } = require("uuid");
const { Pool } = require("pg");
const bcrypt = require("bcryptjs");

require("dotenv").config(); // Loads variables from .env file

const poolConfig = {
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  host: process.env.POSTGRES_HOST,
  port: process.env.POSTGRES_PORT,
  database: process.env.POSTGRES_DB,
};

const pool = new Pool(poolConfig);

/**
 * Create a new user.
 * @param {Object} userData - Object containing user details: username, email, password.
 * @returns {Promise<Object>} Object with the ID and username of the newly created user.
 * @throws {Error} Throws an error if the user already exists or an issue occurs during user creation.
 */
const createUser = async (userData) => {
  const { username, email, password } = userData;
  const randomUUID = uuidv4();
  const client = await pool.connect();

  try {
    // Check if the user with the provided email already exists
    const checkUser = await client.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (checkUser.rows.length > 0) {
      throw new Error("User already exists");
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    // If user doesn't exist, proceed with registration
    //   const hashedPassword = await bcrypt.hash(password, 10);
    await client.query(
      "INSERT INTO users (id, username, email, password) VALUES ($1, $2, $3, $4)",
      [randomUUID, username, email, hashedPassword]
    );

    return { id: randomUUID, username };
  } catch (error) {
    throw error;
  } finally {
    client.release();
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
    const client = await pool.connect();

    // Delete the recipe from the database
    const deleteQuery = `
          DELETE FROM users
          WHERE id = $1
          RETURNING id;
        `;

    const result = await client.query(deleteQuery, [userId]);

    client.release();

    if (result.rowCount === 0) {
      return null; // Recipe not found
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
const getUserByEmail = async (email) => {
  const client = await pool.connect();

  try {
    const query =
      "SELECT id, username, email, password FROM users WHERE email = $1";
    const result = await client.query(query, [email]);

    if (result.rows.length === 0) {
      return null;
    }

    return {
      id: result.rows[0].id,
      username: result.rows[0].username,
      email: result.rows[0].email,
      password: result.rows[0].password, // Note: Ideally, don't return the password here for security reasons.
    };
  } catch (error) {
    throw new Error("Error fetching user by email");
  } finally {
    client.release();
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
    const client = await pool.connect();
    const user = await client.query("SELECT * FROM users WHERE id = $1", [
      userId,
    ]);
    client.release();

    if (user.rows.length === 0) {
      return null; // User not found
    }

    // Extract user details
    const userData = {
      id: user.rows[0].id,
      username: user.rows[0].username,
      email: user.rows[0].email,
      // Include other user details as needed
    };

    return userData;
  } catch (error) {
    throw new Error("Error fetching user by ID");
  }
};

/**
 * Delete all users from the database.
 * @returns {Promise<Object>} Success message confirming the deletion of all users.
 * @throws {Error} Throws an error if there's an issue in deleting all users.
 */
const deleteAllUsers = async () => {
  try {
    const client = await pool.connect();

    // Start a transaction (optional but recommended)
    await client.query("BEGIN");

    // Delete all recipes from the table
    const deleteQuery = `DELETE FROM users`;
    await client.query(deleteQuery);

    // Commit the transaction
    await client.query("COMMIT");

    // Release the client back to the pool
    client.release();

    return { message: "All users deleted successfully" };
  } catch (err) {
    // Rollback the transaction in case of errors
    await client.query("ROLLBACK");
    console.error("Error deleting all users:", err);
    throw new Error("Error deleting all users");
  }
};

module.exports = {
  createUser,
  deleteUser,
  getUserByEmail,
  getUserById,
  deleteAllUsers,
};
