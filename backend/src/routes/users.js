const router = require('express').Router();
const {
  getAllUsers,
  getUserById,
  createUser,
  getDashboardStats,
} = require('../controllers/userController');
const { authenticate, authorize } = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const { registerValidation } = require('../validations/rules');
const { body } = require('express-validator');

router.use(authenticate, authorize('admin'));

router.get('/stats', getDashboardStats);
router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.post(
  '/',
  [
    ...registerValidation,
    body('role').isIn(['admin', 'user', 'owner']).withMessage('Invalid role'),
  ],
  validate,
  createUser
);

module.exports = router;
