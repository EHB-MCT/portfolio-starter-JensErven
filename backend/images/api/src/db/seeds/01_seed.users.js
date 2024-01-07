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

  return knex("users").insert(usersToCreate);
};
