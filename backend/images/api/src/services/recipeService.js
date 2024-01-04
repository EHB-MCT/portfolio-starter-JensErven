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

const parseJSONField = (field) => {
  return field ? JSON.parse(field) : [];
};

const getAllRecipes = async () => {
  try {
    const client = await pool.connect();

    // Fetch specific columns from the database
    const result = await client.query(
      "SELECT id, recipe_name, description FROM recipes"
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

const getRecipeById = async (recipeId) => {
  try {
    const client = await pool.connect();

    // Fetch a recipe by ID from the database
    const result = await client.query(
      "SELECT id, recipe_name, description FROM recipes WHERE id = $1",
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

const createRecipe = async (recipeDetails) => {
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
   INSERT INTO recipes (id, recipe_name, description, instructions, ingredients)
   VALUES ($1, $2, $3, $4, $5)
   RETURNING id;
 `;
    const values = [
      randomUUID,
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

const updateRecipe = async (recipeId, updatedDetails) => {
  try {
    const client = await pool.connect();

    // Update the recipe details in the database
    const { recipe_name, description, instructions } = updatedDetails;

    const updateQuery = `
      UPDATE recipes
      SET recipe_name = $1, description = $2, instructions = $3
      WHERE id = $4
      RETURNING id, recipe_name, description;
    `;

    const values = [recipe_name, description, instructions, recipeId];
    const result = await client.query(updateQuery, values);

    client.release();

    return result.rows[0]; // Return updated recipe details
  } catch (err) {
    console.error("Error updating recipe:", err);
    throw new Error("Error updating recipe");
  }
};

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

module.exports = {
  getAllRecipes,
  getRecipeById,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  getRecipeIngredients,
  getRecipeInstructions,
  deleteAllRecipes,
};
