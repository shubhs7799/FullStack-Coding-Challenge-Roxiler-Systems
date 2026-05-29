const router = require('express').Router();
const { submitRating } = require('../controllers/ratingController');
const { authenticate, authorize } = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const { ratingValidation } = require('../validations/rules');
const { body } = require('express-validator');

router.use(authenticate, authorize('user'));

router.post(
  '/',
  [
    ...ratingValidation,
    body('storeId').isUUID().withMessage('Invalid store ID'),
  ],
  validate,
  submitRating
);

module.exports = router;
