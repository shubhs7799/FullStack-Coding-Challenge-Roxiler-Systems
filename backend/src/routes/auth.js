const router = require('express').Router();
const { register, login, getMe, updatePassword } = require('../controllers/authController');
const { authenticate } = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const {
  registerValidation,
  loginValidation,
  updatePasswordValidation,
} = require('../validations/rules');

router.post('/register', registerValidation, validate, register);
router.post('/login', loginValidation, validate, login);
router.get('/me', authenticate, getMe);
router.patch('/update-password', authenticate, updatePasswordValidation, validate, updatePassword);

module.exports = router;
