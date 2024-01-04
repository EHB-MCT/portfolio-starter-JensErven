const recipeService = require("../services/recipeService");

const getRecipes = async (req, res) => {
  try {
    const recipes = await recipeService.getAllRecipes();

    return res.json({ recipes });
  } catch (err) {
    res.status(500).send(err);
  }
};

const getRecipe = async (req, res) => {
  const { recipeId } = req.params;
  try {
    const recipe = await recipeService.getRecipeById(recipeId);

    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    return res.json({ recipe });
  } catch (err) {
    res.status(500).send(err);
  }
};

const createRecipe = async (req, res) => {
  const { recipe_name, description, instructions, ingredients, userId } =
    req.body;
  try {
    const newRecipe = await recipeService.createRecipe(userId, {
      recipe_name,
      description,
      instructions,
      ingredients,
    });

    return res.status(201).json({ recipe: newRecipe });
  } catch (err) {
    res.status(500).send(err);
  }
};

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
    res.status(500).send(err);
  }
};

const deleteRecipe = async (req, res) => {
  const { recipeId } = req.params;
  try {
    const deletedRecipe = await recipeService.deleteRecipe(recipeId);

    if (!deletedRecipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    return res.json({ message: "Recipe deleted successfully" });
  } catch (err) {
    res.status(500).send(err);
  }
};

const getRecipeIngredients = async (req, res) => {
  const { recipeId } = req.params;
  try {
    const ingredients = await recipeService.getRecipeIngredients(recipeId);

    return res.json({ ingredients });
  } catch (err) {
    res.status(500).send(err);
  }
};

const getRecipeInstructions = async (req, res) => {
  const { recipeId } = req.params;
  try {
    const instructions = await recipeService.getRecipeInstructions(recipeId);

    return res.json({ instructions });
  } catch (err) {
    res.status(500).send(err);
  }
};

const deleteAllRecipes = async (req, res) => {
  try {
    const result = await recipeService.deleteAllRecipes();

    return res.json(result);
  } catch (err) {
    res.status(500).send(err);
  }
};

const getLoggedInUserRecipes = async (req, res) => {
  const { userId } = req.params;
  try {
    const recipes = await recipeService.getRecipesByUserId(userId);

    return res.json({ recipes });
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
