const express = require("express");
const router = express.Router();
const {
  getRecipes,
  getRecipe,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  getRecipeIngredients,
  getRecipeInstructions,
  deleteAllRecipes,
  getLoggedInUserRecipes,
} = require("../controllers/recipe");

/**
 * Retrieve a list of all recipes.
 * @name Get All Recipes
 * @route {GET} /api/recipes
 * @returns {Array.<Object>} Array of recipe objects without the ingredients and instructions.
 */
router.get("/", getRecipes);

/**
 * Retrieve a specific recipe by its ID.
 * @name Get Recipe by ID
 * @route {GET} /api/recipes/:recipeId
 * @param {string} recipeId - ID of the recipe.
 * @returns {Object} Details of the requested recipe without the ingredients and instructions.
 */
router.get("/:recipeId", getRecipe);

/**
 * Create a new recipe.
 * @name Create Recipe
 * @route {POST} /api/recipes
 * @param {Object} Recipe details & userId - e.g., recipe_name, description, instructions, ingredients, userId .
 * @returns {Object} Details of the newly created recipe.
 */
router.post("/", createRecipe);

/**
 * Update an existing recipe by its ID.
 * @name Update Recipe
 * @route {PUT} /api/recipes/:recipeId
 * @param {string} recipeId - ID of the recipe to update.
 * @param {Object} Updated recipe details - e.g., recipe_name, description, instructions, ingredients.
 * @returns {Object} Details of the updated recipe - eg., recipe_name, description.
 */
router.put("/:recipeId", updateRecipe);

/**
 * Delete a recipe by its ID.
 * @name Delete Recipe
 * @route {DELETE} /api/recipes/:recipeId
 * @param {string} recipeId - ID of the recipe to delete.
 * @returns {string} Confirmation message.
 */
router.delete("/:recipeId", deleteRecipe);

/**
 * Retrieve the list of ingredients for a specific recipe.
 * @name Get Recipe Ingredients
 * @route {GET} /api/recipes/:recipeId/ingredients
 * @param {string} recipeId - ID of the recipe.
 * @returns {Array.<Object>} Array of ingredients for the specified recipe.
 */
router.get("/:recipeId/ingredients", getRecipeIngredients);

/**
 * Retrieve the instructions for a specific recipe.
 * @name Get Recipe Instructions
 * @route {GET} /api/recipes/:recipeId/instructions
 * @param {string} recipeId - ID of the recipe.
 * @returns {Array} Array of instructions for the specified recipe.
 */
router.get("/:recipeId/instructions", getRecipeInstructions);

/**
 * Delete all recipes from the database.
 * @name Delete All Recipes
 * @route {DELETE} /api/recipes
 * @returns {string} Confirmation message.
 */
router.delete("/", deleteAllRecipes);

/**
 * Retrieve all recipes with specific user_id
 * @name Get All Recipes from specific user
 * @route {GET} /api/recipes/user/:userId
 * @param {string} userId - ID of the user.
 * @returns {Array.<Object>} Array of recipe objects without the ingredients and instructions.
 */
router.get("/user/:userId", getLoggedInUserRecipes);

module.exports = router;
