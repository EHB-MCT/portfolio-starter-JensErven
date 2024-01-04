const userService = require("../services/userService");
const bcrypt = require("bcryptjs");

const registerUser = async (req, res) => {
  try {
    const newUser = await userService.createUser(req.body);
    res.status(201).json({ user: newUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userService.getUserByEmail(email);

    if (!user) {
      return res
        .status(401)
        .json({ error: "User with this email doesn't exist" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: "Incorrect password" });
    }

    const userData = {
      id: user.id,
      username: user.username,
    };

    return res
      .status(200)
      .json({ message: "Login successful", user: userData });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

const getUserById = async (req, res) => {
  const { userId } = req.params;
  try {
    const foundUser = await userService.getUserById(userId);
    res.status(201).json({ user: foundUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteUser = async (req, res) => {
  const { userId } = req.params;
  try {
    const deletedUser = await userService.deleteUser(userId);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).send(err);
  }
};

const deleteAllUsers = async (req, res) => {
  try {
    const result = await userService.deleteAllUsers();

    return res.json(result);
  } catch (err) {
    res.status(500).send(err);
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserById,
  deleteUser,
  deleteAllUsers,
};
