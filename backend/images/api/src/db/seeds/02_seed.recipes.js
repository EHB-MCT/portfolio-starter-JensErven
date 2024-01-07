const { v4: uuidv4 } = require("uuid");

exports.seed = async function (knex) {
  const recipesToCreate = [];
  const users = await knex.select("id").from("users");

  // Create 20 recipes associated with random users
  for (let i = 0; i < 20; i++) {
    const randomUser = users[Math.floor(Math.random() * users.length)];

    const recipe = {
      id: uuidv4(),
      user_id: randomUser.id,
      recipe_name: `Recipe ${i + 1}`,
      description: `Description for Recipe ${i + 1}`,
      instructions: JSON.stringify([
        "Step 1: Do something",
        "Step 2: Do something else",
      ]),
      ingredients: JSON.stringify([
        { name: "Ingredient 1", quantity: "2 cups" },
        { name: "Ingredient 2", quantity: "1 tbsp" },
      ]),
    };

    recipesToCreate.push(recipe);
  }

  // Insert recipes associated with random users
  await knex("recipes").insert(recipesToCreate);
};
