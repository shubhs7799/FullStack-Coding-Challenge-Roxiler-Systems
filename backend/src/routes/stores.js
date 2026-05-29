const router = require('express').Router();
const { getAllStores, createStore, getOwnerDashboard } = require('../controllers/storeController');
const { authenticate, authorize } = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const { storeValidation } = require('../validations/rules');

// All routes require login
router.use(authenticate);

router.get('/', getAllStores);
router.get('/owner-dashboard', authorize('owner'), getOwnerDashboard);
router.post('/', authorize('admin'), storeValidation, validate, createStore);

module.exports = router;
