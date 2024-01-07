const { v4: uuidv4 } = require("uuid");
const { Pool } = require("pg");
const knex = require("knex")(require("../db/knexfile"));

/**
 * Retrieve a list of all recipes.
 * @returns {Promise<Array>} Array of recipe objects without the ingredients and instructions.
 */
const getAllRecipes = async () => {
  try {
    const recipes = await knex
      .select("id", "recipe_name", "description", "user_id")
      .from("recipes");
    return recipes;
  } catch (error) {
    console.error("Error fetching recipes:", error);
    throw new Error("Error fetching recipes");
  }
};

/**
 * Retrieve a recipe by its id.
 * @param {string} recipeId - The ID of the recipe.
 * @returns {Promise<Object|null>} Object with this one recipe found or null if not found.
 * @throws {Error} Throws an error if there's an issue with fetching the recipe.
 */
const getRecipeById = async (recipeId) => {
  try {
    const recipe = await knex
      .select("id", "recipe_name", "description", "user_id")
      .from("recipes")
      .where({ id: recipeId })
      .first();

    return recipe || null;
  } catch (error) {
    console.error("Error fetching recipe by ID:", error);
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
    const { recipe_name, description, instructions, ingredients } =
      recipeDetails;
    const randomUUID = uuidv4();

    // Stringify instructions and ingredients as JSON strings
    const stringifiedInstructions = JSON.stringify(instructions);
    const stringifiedIngredients = JSON.stringify(ingredients);

    const newRecipe = {
      id: randomUUID,
      user_id: userId,
      recipe_name,
      description,
      instructions: stringifiedInstructions,
      ingredients: stringifiedIngredients,
    };

    // Insert a new recipe into the database using Knex's insert method
    await knex("recipes").insert(newRecipe);

    // Return the newly created recipe details
    return { id: randomUUID, ...recipeDetails };
  } catch (error) {
    console.error("Error creating recipe:", error);
    throw new Error("Error creating recipe");
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
    const { recipe_name, description, instructions, ingredients } =
      updatedDetails;

    const updatedRecipe = {};

    if (recipe_name !== undefined) {
      updatedRecipe.recipe_name = recipe_name;
    }
    if (description !== undefined) {
      updatedRecipe.description = description;
    }
    if (instructions !== undefined) {
      updatedRecipe.instructions = JSON.stringify(instructions);
    }
    if (ingredients !== undefined) {
      updatedRecipe.ingredients = JSON.stringify(ingredients);
    }

    // Update the recipe in the database using Knex's update method
    await knex("recipes").where({ id: recipeId }).update(updatedRecipe);

    // Return the updated recipe details
    return { id: recipeId, ...updatedDetails };
  } catch (error) {
    console.error("Error updating recipe:", error);
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
    // Delete the recipe from the database using Knex's delete method
    const deletedRecipe = await knex("recipes")
      .where({ id: recipeId })
      .del()
      .returning("id");

    if (!deletedRecipe.length) {
      return null; // Recipe not found
    }

    return { message: "Recipe deleted successfully" };
  } catch (error) {
    console.error("Error deleting recipe:", error);
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
    // Retrieve ingredients for the specific recipe using Knex
    const recipe = await knex("recipes")
      .select("ingredients")
      .where({ id: recipeId })
      .first();

    if (!recipe) {
      return null; // Recipe not found
    }

    return recipe.ingredients;
  } catch (error) {
    console.error("Error fetching recipe ingredients:", error);
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
    // Retrieve instructions for the specific recipe using Knex
    const recipe = await knex("recipes")
      .select("instructions")
      .where({ id: recipeId })
      .first();

    if (!recipe) {
      return null; // Recipe not found
    }

    return recipe.instructions;
  } catch (error) {
    console.error("Error fetching recipe instructions:", error);
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
    // Delete all recipes using Knex
    await knex("recipes").del();

    return { message: "All recipes deleted successfully" };
  } catch (error) {
    console.error("Error deleting all recipes:", error);
    throw new Error("Error deleting all recipes");
  }
};

/**
 * Get all the recipes from a specific user
 * @param {string} userId - The ID of the user.
 * @returns {Promise<Array>} Array of recipe objects without the ingredients and instructions.
 * @throws {Error} Throws an error if there's an issue in fetching the recipes from that user.
 */
const getRecipesByUserId = async (userId) => {
  try {
    // Fetch recipes by user ID using Knex
    const recipes = await knex("recipes")
      .select("id", "recipe_name", "description", "user_id")
      .where("user_id", userId);

    return recipes;
  } catch (error) {
    console.error("Error fetching recipes with userId:", error);
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
