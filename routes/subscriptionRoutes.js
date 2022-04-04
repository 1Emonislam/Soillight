const express = require('express');
const { subscriptionAdd, mySubscriptionAllGet, singleSubscriptionGet } = require('../controllers/subscriptionControllers');
const { protect } = require('../middlewares/authMiddleware');
const router = express.Router();
router.route('/subscription-add').post(protect, subscriptionAdd);
router.route('/my-subscription').post(protect, mySubscriptionAllGet);
router.route('/subscription/:id').post(protect, singleSubscriptionGet);
module.exports = router;