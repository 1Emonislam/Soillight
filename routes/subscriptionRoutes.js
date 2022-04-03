const express = require('express');
const { subscriptionAdd } = require('../controllers/subscriptionControllers');
const { protect } = require('../middlewares/authMiddleware');
const router = express.Router();
router.route('/subscription-add').post(protect, subscriptionAdd);
module.exports = router;