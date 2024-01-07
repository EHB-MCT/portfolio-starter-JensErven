const recipeService = require("../services/recipeService");
const validationHelpers = require("../helpers/validationHelpers");

/**
 * Get all recipes.
 * @param {Object} req - The request object.
 */
const getRecipes = async (req, res) => {
  try {
    const recipes = await recipeService.getAllRecipes();

    return res.status(200).json(recipes);
  } catch (err) {
    res.status(500).send(err);
  }
};

/**
 * Get a recipe by its ID.
 * @param {Object} req - The request object containing the recipe ID.
 */
const getRecipe = async (req, res) => {
  try {
    const { recipeId } = req.params;
    const recipe = await recipeService.getRecipeById(recipeId);

    if (recipe.status === 500) {
      //recipe not found
      return res.status(404).json({ message: "Recipe not found" });
    }

    return res.status(200).json(recipe.data);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

/**
 * Create a new recipe.
 * @param {Object} req - The request object containing recipe details in the body.
 */
const createRecipe = async (req, res) => {
  try {
    const { recipe_name, description, instructions, ingredients, userId } =
      req.body;
    // Check if all required variables are present in req.body
    if (
      !recipe_name ||
      !description ||
      !instructions ||
      !ingredients ||
      !userId
    ) {
      return res
        .status(400)
        .json({ message: "Missing required fields in the request body" });
    }
    // Validate each request variable
    const isValidRecipeName = validationHelpers.validateIfString(recipe_name);
    const isValidDescription = validationHelpers.validateIfString(description);
    const isValidUserId = validationHelpers.validateIfString(userId);

    // Check if any of the variables are invalid strings
    if (!isValidRecipeName || !isValidDescription || !isValidUserId) {
      return res.status(400).json({ message: "Invalid request body" });
    }

    const newRecipe = await recipeService.createRecipe(userId, {
      recipe_name,
      description,
      instructions,
      ingredients,
    });
    if (newRecipe.status === 500) {
      // user not found
      return res.status(404).json({ message: "User not found" });
    } else {
      return res.status(200).json({ recipe: newRecipe });
    }
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
};

/**
 * Update a recipe by its ID.
 * @param {Object} req - The request object containing the recipe ID and updated details.
 */
const updateRecipe = async (req, res) => {
  const { recipeId } = req.params;
  const updatedDetails = req.body;

  try {
    const updatedRecipe = await recipeService.updateRecipe(
      recipeId,
      updatedDetails
    );

    if (!updatedRecipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    return res.json({ recipe: updatedRecipe });
  } catch (err) {
    return res.status(500).send(err);
  }
};

/**
 * Delete recipe by its ID.
 * @param {Object} req - The request object containing the recipe ID.
 */
const deleteRecipe = async (req, res) => {
  try {
    const { recipeId } = req.params;
    const deletedRecipe = await recipeService.deleteRecipe(recipeId);

    if (deletedRecipe.status === 404) {
      // recipe not found
      return res.status(404).json({ message: deletedRecipe.message });
    } else {
      return res.status(200).json({ message: "Recipe deleted successfully" });
    }
  } catch (err) {
    return res.status(500).send(err);
  }
};

/**
 * Get ingredients of a recipe by its ID.
 * @param {Object} req - The request object containing the recipe ID.
 */
const getRecipeIngredients = async (req, res) => {
  try {
    const { recipeId } = req.params;
    const ingredients = await recipeService.getRecipeIngredients(recipeId);
    if (ingredients.status === 500) {
      // recipe not found
      return res.status(404).json({ message: "recipe not found" });
    }
    return res.status(200).json(ingredients.data);
  } catch (err) {
    return res.status(500).send(err);
  }
};

/**
 * Get instructions of a recipe by its ID.
 * @param {Object} req - The request object containing the recipe ID.
 */
const getRecipeInstructions = async (req, res) => {
  try {
    const { recipeId } = req.params;
    const instructions = await recipeService.getRecipeInstructions(recipeId);
    if (instructions.status === 500) {
      // recipe not found
      return res.status(404).json({ message: "recipe not found" });
    }
    return res.status(200).json(instructions.data);
  } catch (err) {
    return res.status(500).send(err);
  }
};

/**
 * Delete all recipes.
 * @param {Object} req - The request object.
 */
const deleteAllRecipes = async (req, res) => {
  try {
    const result = await recipeService.deleteAllRecipes();

    return res.status(200).json(result);
  } catch (err) {
    res.status(500).send(err);
  }
};

/**
 * Get recipes of the logged-in user by their ID.
 * @param {Object} req - The request object containing the user ID.
 */
const getLoggedInUserRecipes = async (req, res) => {
  const { userId } = req.params;
  try {
    const recipes = await recipeService.getRecipesByUserId(userId);

    return res.json(recipes);
  } catch (err) {
    res.status(500).send(err);
  }
};

module.exports = {
  getRecipes,
  getRecipe,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  getRecipeIngredients,
  getRecipeInstructions,
  deleteAllRecipes,
  getLoggedInUserRecipes,
};
