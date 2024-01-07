const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");
const usernameGenerator = require("username-generator");

exports.seed = async function (knex) {
  // Use async function to enable await
  const usersToCreate = [];
  const password = "your_password_here"; // Replace with your actual password

  for (let i = 0; i < 10; i++) {
    const username = usernameGenerator.generateUsername("-", ""); // Generate a username
    const email = `${username}@example.com`; // Create an email based on the username
    const hashedPassword = await bcrypt.hash(password, 10);

    usersToCreate.push({
      id: uuidv4(),
      username,
      email,
      password: hashedPassword,
    });
  }

  // Adding an extra test user with a specific user ID
  const specificUserId = "c81a0696-4e68-4e53-a0d6-362fd0a11e2d"; // Replace with your desired user ID
  const existingUser = await knex("users")
    .where({ id: specificUserId })
    .first();

  if (!existingUser) {
    // Adding the extra test user if it doesn't already exist
    const specificUserUsername = "test-user";
    const specificUserEmail = "test-user@example.com";
    const specificUserPassword = await bcrypt.hash("test-password", 10); // Replace with your desired password

    usersToCreate.push({
      id: specificUserId,
      username: specificUserUsername,
      email: specificUserEmail,
      password: specificUserPassword,
    });
  }

  return knex("users").insert(usersToCreate);
};
