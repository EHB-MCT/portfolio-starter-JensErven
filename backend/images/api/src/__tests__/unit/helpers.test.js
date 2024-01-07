const {
  checkUserEmail,
  validatePassword,
  validateUsername,
  validateTheEmail,
  validateIfString,
} = require("../../helpers/validationHelpers");

// validateTheEmail function validation
describe("Email Validation", () => {
  test("Valid email format", () => {
    const validEmail = "example@example.com";
    expect(validateTheEmail(validEmail)).toBe(true);
  });

  test("Invalid email format", () => {
    const invalidEmail = "invalidemail.com";
    expect(validateTheEmail(invalidEmail)).toBe(false);
  });

  test("Invalid email format, typeof Int", () => {
    const invalidEmail = 1;
    expect(validateTheEmail(invalidEmail)).toBe(false);
  });
});

// validatePassword function validation
describe("Password Validation", () => {
  test("Valid password format", () => {
    const validPassword = "valid-password123!";
    expect(validatePassword(validPassword)).toBe(true);
  });

  test("Invalid password format, less then 8 characters", () => {
    const invalidPassword = "1324567";
    expect(validatePassword(invalidPassword)).toBe(false);
  });

  test("Invalid password format, typeof Int", () => {
    const invalidPassword = 1;
    expect(validatePassword(invalidPassword)).toBe(false);
  });
});

// validateUsername function validation
describe("Username Validation", () => {
  test("Valid username format", () => {
    const validUsername = "firstname-lastname";
    expect(validateUsername(validUsername)).toBe(true);
  });

  test("Invalid username format, less then 6 characters", () => {
    const invalidUsername = "name";
    expect(validateUsername(invalidUsername)).toBe(false);
  });

  test("Invalid username format, typeof Int", () => {
    const invalidUsername = 1;
    expect(validateUsername(invalidUsername)).toBe(false);
  });
});

// validateIfString function validation
describe("validateIfString Validation", () => {
  test("should return true if the value is a string", () => {
    const stringValue = "This is a string";
    expect(validateIfString(stringValue)).toBe(true);
  });

  test("should return false if the value is not a string", () => {
    const nonStringValue = 12345; // Not a string
    expect(validateIfString(nonStringValue)).toBe(false);
  });
});
