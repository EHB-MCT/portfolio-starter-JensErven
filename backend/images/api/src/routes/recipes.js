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
} = require("../controllers/recipe");

/**
 * Retrieve a list of all recipes.
 * @name Get All Recipes
 * @route {GET} /api/recipes
 * @returns {Array.<Object>} Array of recipe objects.
 */
router.get("/", getRecipes);

/**
 * Retrieve a specific recipe by its ID.
 * @name Get Recipe by ID
 * @route {GET} /api/recipes/:recipeId
 * @param {string} recipeId - ID of the recipe.
 * @returns {Object} Details of the requested recipe.
 */
router.get("/:recipeId", getRecipe);

/**
 * Create a new recipe.
 * @name Create Recipe
 * @route {POST} /api/recipes
 * @param {Object} Recipe details - e.g., recipe_name, description, instructions.
 * @returns {Object} Details of the newly created recipe.
 */
router.post("/", createRecipe);

/**
 * Update an existing recipe by its ID.
 * @name Update Recipe
 * @route {PUT} /api/recipes/:recipeId
 * @param {string} recipeId - ID of the recipe to update.
 * @param {Object} Updated recipe details.
 * @returns {Object} Details of the updated recipe.
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
 * @returns {Array.<Object>} Array of instructions for the specified recipe.
 */
router.get("/:recipeId/instructions", getRecipeInstructions);

module.exports = router;
