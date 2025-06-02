const { body } = require('express-validator');

const binValidationRules = [
  body('binId').notEmpty().withMessage('Bin ID is required'),
  body('location').notEmpty().withMessage('Location is required'),
  body('coordinates.lat')
    .isFloat({ min: -90, max: 90 })
    .withMessage('Latitude must be valid'),
  body('coordinates.lng')
    .isFloat({ min: -180, max: 180 })
    .withMessage('Longitude must be valid'),
  body('wasteLevel').optional().isInt({ min: 0, max: 100 }),
  body('maintenance').optional().isString(),
  body('deviceStatus').optional().isIn(['online', 'offline']),
  body('lastUpdate').optional().isISO8601().toDate(),
];

module.exports = { binValidationRules };
