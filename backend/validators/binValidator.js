const { body } = require('express-validator');

exports.binValidationRules = [
  body('binId').notEmpty().withMessage('Bin ID is required'),
  body('location').notEmpty().withMessage('Location is required'),
  body('status').isIn(['empty', 'half-full', 'full']).withMessage('Invalid status'),
  body('fillLevel').isNumeric().withMessage('Fill level must be a number'),
];
//bin validator.js
