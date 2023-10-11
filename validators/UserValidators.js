const { check } = require('express-validator');

const validateUser = [
    check('username').notEmpty().withMessage('Username is required'),
    check('email').isEmail().withMessage('Invalid email format'),
    check('country').notEmpty().withMessage('Country is required'),
    check('state').notEmpty().withMessage('State is required'),
    check('city').notEmpty().withMessage('City is required'),
  ];

module.exports = validateUser;  