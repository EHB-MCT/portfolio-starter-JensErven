const { v4: uuidv4 } = require("uuid");
const { Pool } = require("pg");

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
 * Retrieve a list of all recipes.
 * @returns {Promise<Array>} Array of recipe objects without the ingredients and instructions.
 */
const getAllRecipes = async () => {
  try {
    const client = await pool.connect();

    // Fetch specific columns from the database
    const result = await client.query(
      "SELECT id, recipe_name, description, user_id FROM recipes"
    );

    // Release the client back to the pool
    client.release();

    // Return the retrieved recipes
    return result.rows;
  } catch (err) {
    // Log and throw error if any
    console.error("Error fetching recipes:", err);
    throw new Error("Error fetching recipes");
  }
};

/**
 * Retrieve a recipe by its id.
 * @param {string} recipeId - The ID of the recipe.
 * @returns {Promise<Array>} Array with this one recipe found.
 * @throws {Error} Throws an error if there's an issue with fetching the recipe.
 */
const getRecipeById = async (recipeId) => {
  try {
    const client = await pool.connect();

    // Fetch a recipe by ID from the database
    const result = await client.query(
      "SELECT id, recipe_name, description, user_id FROM recipes WHERE id = $1",
      [recipeId]
    );

    // Release the client back to the pool
    client.release();

    // Return the retrieved recipe
    return result.rows[0];
  } catch (err) {
    // Log and throw error if any
    console.error("Error fetching recipe by ID:", err);
    throw new Error("Error fetching recipe by ID");
  }
};

/**
 * Create a new recipe for a specific user in the database.
 * @param {string} userId - The ID of the user creating the recipe.
 * @param {Object} recipeDetails - Details of the recipe to be created.
 * @returns {Promise<Object>} Details of the newly created recipe with its unique ID.
 * @throws {Error} Throws an error if there's an issue creating the recipe.
 */
const createRecipe = async (userId, recipeDetails) => {
  try {
    // Establish a connection from the pool
    const client = await pool.connect();

    // Start a transaction
    await client.query("BEGIN");
    const randomUUID = uuidv4();
    // Example recipe details (adjust as needed)
    const { recipe_name, description, instructions, ingredients } =
      recipeDetails;

    // Stringify instructions and ingredients as JSON arrays
    const stringifiedInstructions = JSON.stringify(instructions);
    const stringifiedIngredients = JSON.stringify(ingredients);

    // Insert a new recipe into the database
    const insertQuery = `
    INSERT INTO recipes (id, user_id, recipe_name, description, instructions, ingredients)
    VALUES ($1, $2, $3, $4, $5, $6)
   RETURNING id;
 `;
    const values = [
      randomUUID,
      userId,
      recipe_name,
      description,
      stringifiedInstructions,
      stringifiedIngredients,
    ];
    const result = await client.query(insertQuery, values);

    // Commit the transaction
    await client.query("COMMIT");

    // Release the client back to the pool
    client.release();

    // Return the ID of the newly inserted recipe
    return { id: result.rows[0].id, ...recipeDetails };
  } catch (err) {
    // Log the error for debugging (you might want to log to a file or console)
    console.error("Error creating recipe:", err);

    // Rethrow the actual error for visibility
    throw err;
  }
};

/**
 * Update the props of a specific recipe.
 * @param {string} recipeId - The ID of the recipe.
 * @param {Object} recipeDetails - Details of the recipe to be updated.
 * @returns {Promise<Object>} Details of the updated recipe with its unique ID.
 * @throws {Error} Throws an error if there's an issue in updating the recipe.
 */
const updateRecipe = async (recipeId, updatedDetails) => {
  try {
    const client = await pool.connect();

    const values = [];
    let updateQuery = "UPDATE recipes SET";

    // Destructure the updated details
    const { recipe_name, description, instructions, ingredients } =
      updatedDetails;

    let index = 1; // Start index for placeholder values

    if (recipe_name !== undefined) {
      updateQuery += ` recipe_name = $${index},`;
      values.push(recipe_name);
      index++;
    }
    if (description !== undefined) {
      updateQuery += ` description = $${index},`;
      values.push(description);
      index++;
    }
    if (instructions !== undefined) {
      updateQuery += ` instructions = $${index},`;
      values.push(JSON.stringify(instructions));
      index++;
    }
    if (ingredients !== undefined) {
      updateQuery += ` ingredients = $${index},`;
      values.push(JSON.stringify(ingredients));
      index++;
    }

    // Remove the trailing comma from the updateQuery
    updateQuery = updateQuery.slice(0, -1);

    updateQuery += " WHERE id = $5 RETURNING id, recipe_name, description;";

    // Add recipeId to the end of the values array
    values.push(recipeId);

    const result = await client.query(updateQuery, values);
    client.release();

    return result.rows[0]; // Return updated recipe details
  } catch (err) {
    console.error("Error updating recipe:", err);
    throw new Error("Error updating recipe");
  }
};

/**
 * Delete a specific recipe
 * @param {string} recipeId - The ID of the recipe.
 * @returns {Promise<Object>} a success message.
 * @throws {Error} Throws an error if there's an issue in deleting the recipe.
 */
const deleteRecipe = async (recipeId) => {
  try {
    const client = await pool.connect();

    // Delete the recipe from the database
    const deleteQuery = `
      DELETE FROM recipes
      WHERE id = $1
      RETURNING id;
    `;

    const result = await client.query(deleteQuery, [recipeId]);

    client.release();

    if (result.rowCount === 0) {
      return null; // Recipe not found
    }

    return { message: "Recipe deleted successfully" };
  } catch (err) {
    console.error("Error deleting recipe:", err);
    throw new Error("Error deleting recipe");
  }
};

/**
 * Get the ingredients from a specific recipe
 * @param {string} recipeId - The ID of the recipe.
 * @returns {Promise<Object>} Ingredients of the specific recipe.
 * @throws {Error} Throws an error if there's an issue in fetching the ingredients.
 */
const getRecipeIngredients = async (recipeId) => {
  try {
    const client = await pool.connect();

    // Retrieve instructions for the specific recipe
    const query = `
      SELECT ingredients
      FROM recipes
      WHERE id = $1;
    `;

    const result = await client.query(query, [recipeId]);

    client.release();

    if (result.rowCount === 0) {
      return null; // Recipe not found
    }

    return result.rows[0].ingredients;
  } catch (err) {
    console.error("Error fetching recipe ingredients:", err);
    throw new Error("Error fetching recipe ingredients");
  }
};

/**
 * Get the instructions from a specific recipe
 * @param {string} recipeId - The ID of the recipe.
 * @returns {Promise<Object>} Instructions of the specific recipe.
 * @throws {Error} Throws an error if there's an issue in fetching the instructions.
 */
const getRecipeInstructions = async (recipeId) => {
  try {
    const client = await pool.connect();

    // Retrieve instructions for the specific recipe
    const query = `
      SELECT instructions
      FROM recipes
      WHERE id = $1;
    `;

    const result = await client.query(query, [recipeId]);

    client.release();

    if (result.rowCount === 0) {
      return null; // Recipe not found
    }

    return result.rows[0].instructions;
  } catch (err) {
    console.error("Error fetching recipe instructions:", err);
    throw new Error("Error fetching recipe instructions");
  }
};

/**
 * Delete all the recipes
 * @returns {Promise<Object>}  a success message.
 * @throws {Error} Throws an error if there's an issue in deleting the recipes.
 */
const deleteAllRecipes = async () => {
  try {
    const client = await pool.connect();

    // Start a transaction (optional but recommended)
    await client.query("BEGIN");

    // Delete all recipes from the table
    const deleteQuery = `DELETE FROM recipes`;
    await client.query(deleteQuery);

    // Commit the transaction
    await client.query("COMMIT");

    // Release the client back to the pool
    client.release();

    return { message: "All recipes deleted successfully" };
  } catch (err) {
    // Rollback the transaction in case of errors
    await client.query("ROLLBACK");
    console.error("Error deleting all recipes:", err);
    throw new Error("Error deleting all recipes");
  }
};

/**
 * Get all the recipes from specific user
 * @param {string} userId - The ID of the user.
 * @returns {Promise<Array>} Array of recipe objects without the ingredients and instructions.
 * @throws {Error} Throws an error if there's an issue in fetching the recipes from that user.
 */
const getRecipesByUserId = async (userId) => {
  try {
    const client = await pool.connect();

    // Fetch a recipe by ID from the database
    const result = await client.query(
      "SELECT id, recipe_name, description, user_id FROM recipes WHERE user_id = $1",
      [userId]
    );

    // Release the client back to the pool
    client.release();

    // Return the retrieved recipes
    return result.rows;
  } catch (err) {
    // Log and throw error if any
    console.error("Error fetching recipes with userId:", err);
    throw new Error("Error fetching recipes with userId");
  }
};

module.exports = {
  getAllRecipes,
  getRecipeById,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  getRecipeIngredients,
  getRecipeInstructions,
  deleteAllRecipes,
  getRecipesByUserId,
};
