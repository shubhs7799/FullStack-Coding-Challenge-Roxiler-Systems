const { body } = require('express-validator');

const passwordRules = body('password')
  .isLength({ min: 8, max: 16 })
  .withMessage('Password must be 8-16 characters')
  .matches(/[A-Z]/)
  .withMessage('Password must contain at least one uppercase letter')
  .matches(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/)
  .withMessage('Password must contain at least one special character');

const emailRules = body('email')
  .isEmail()
  .withMessage('Must be a valid email')
  .normalizeEmail();

const nameRules = body('name')
  .isLength({ min: 20, max: 60 })
  .withMessage('Name must be between 20 and 60 characters')
  .trim();

const addressRules = body('address')
  .optional()
  .isLength({ max: 400 })
  .withMessage('Address cannot exceed 400 characters')
  .trim();

const registerValidation = [nameRules, emailRules, passwordRules, addressRules];

const loginValidation = [
  body('email').isEmail().withMessage('Must be a valid email').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
];

const updatePasswordValidation = [passwordRules];

const storeValidation = [
  nameRules,
  emailRules,
  body('address')
    .notEmpty()
    .withMessage('Address is required')
    .isLength({ max: 400 })
    .withMessage('Address cannot exceed 400 characters')
    .trim(),
];

const ratingValidation = [
  body('value')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be an integer between 1 and 5'),
];

module.exports = {
  registerValidation,
  loginValidation,
  updatePasswordValidation,
  storeValidation,
  ratingValidation,
};
