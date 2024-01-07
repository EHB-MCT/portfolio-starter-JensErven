// validate if email has the correct email format.
function validateTheEmail(email) {
  if (typeof email !== "string") {
    return false; // Not a string, return false
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// validate if the password has the correct format.
function validatePassword(password) {
  // Password must be at least 8 characters long & a string
  return typeof password === "string" && password.length >= 8;
}

// validate if the username has the correct format.
function validateUsername(username) {
  // Password must be at least 6 characters long & a string
  return typeof username === "string" && username.length >= 6;
}

// validate if the value is a string
function validateIfString(value) {
  return typeof value === "string";
}

function validateIfUUID(uuid) {
  if (typeof uuid !== "string") {
    return false;
  }

  const userIdRegex =
    /^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$/;
  return userIdRegex.test(uuid);
}

module.exports = {
  validateTheEmail,
  validatePassword,
  validateUsername,
  validateIfString,
  validateIfUUID,
};
