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

const getAllRecipes = async () => {
  try {
    const client = await pool.connect();

    // Fetch all recipes from the database
    const result = await client.query("SELECT * FROM recipes");

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
    const result = await client.query("SELECT * FROM recipes WHERE id = $1", [
      recipeId,
    ]);

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

    // Example recipe details (adjust as needed)
    const { recipe_name, description, instructions, ingredients } =
      recipeDetails;

    // Stringify instructions and ingredients as JSON arrays
    const stringifiedInstructions = JSON.stringify(instructions);
    const stringifiedIngredients = JSON.stringify(ingredients);
    // Insert a new recipe into the database
    const insertQuery = `
   INSERT INTO recipes (recipe_name, description, instructions, ingredients)
   VALUES ($1, $2, $3, $4)
   RETURNING id;
 `;
    const values = [
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

module.exports = {
  getAllRecipes,
  getRecipeById,
  createRecipe,
};
