const express = require('express');
const { subscriptionAdd, mySubscriptionAllGet, singleSubscriptionGet, mySingleSubscription } = require('../controllers/subscriptionControllers');
const { protect } = require('../middlewares/authMiddleware');
const router = express.Router();
router.route('/subscription-add').post(protect, subscriptionAdd);
router.route('/my-subscription').get(protect, mySubscriptionAllGet);
router.route('/my-single-subscription').get(protect, mySingleSubscription)
router.route('/subscription/:id').get(protect, singleSubscriptionGet);
module.exports = router;