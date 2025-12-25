import { ApiError } from "../utils/ApiError.js";

/**
 * Validates if a given string is a correctly formatted email address.
 * @param {string} email - The email string to validate.
 * @returns {boolean} - True if the email is valid, false otherwise.
 */
const isEmail = (email) => {
    if (typeof email !== "string" || email.length === 0) {
        return false;
    }
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
};

/**
 * Checks if a password meets the required strength criteria.
 * Criteria:
 * - At least 8 characters long
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one number
 * - At least one special character
 * @param {string} password - The password string to validate.
 * @returns {boolean} - True if the password is strong, false otherwise.
 */
export const isStrongPassword = (password) => {
    if (typeof password !== "string" || password.length < 8) {
        return false;
    }
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return hasUppercase && hasLowercase && hasNumber && hasSpecialChar;
};

/**
 * Validates if a username meets the specified criteria.
 * Criteria:
 * - At least 3 characters long
 * - Contains only lowercase letters, numbers, and underscores
 * @param {string} username - The username string to validate.
 * @returns {boolean}
 */
export const isValidUsername = (username) => {
    if (typeof username !== "string" || username.length < 3) {
        return false;
    }
    const usernameRegex = /^[a-z0-9_]+$/;
    return usernameRegex.test(username);
};

export const registerUserValidator = (req, res, next) => {
    let { username, password, email, firstName } = req.body;

    email = email?.trim()?.toLowerCase();
    username = username?.trim()?.toLowerCase();
    password = password?.trim();
    firstName = firstName?.trim();

    if (!username || !email || !password || !firstName) {
        throw new ApiError(
            400,
            "Username, email, password, and first name are required"
        );
    }

    req.body.email = email;
    req.body.username = username;
    req.body.firstName = firstName;

    if (!isValidUsername(username)) {
        throw new ApiError(
            400,
            "Username must be at least 3 characters and contain only lowercase letters, numbers, and underscores."
        );
    }

    if (!isEmail(email)) {
        throw new ApiError(400, "Please provide a valid email address");
    }

    if (!isStrongPassword(password)) {
        throw new ApiError(
            400,
            "Password must be at least 8 characters long and include uppercase letters, lowercase letters, numbers, and special characters."
        );
    }

    next();
};

export const loginUserValidator = (req, res, next) => {
    let { identifier, password } = req.body;

    identifier = identifier?.trim();
    password = password?.trim();

    if (!identifier || !password) {
        throw new ApiError(400, "All fields are required");
    }

    req.body.identifier = identifier;
    req.body.password = password;

    next();
};
