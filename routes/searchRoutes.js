const express = require('express');
const {sellerSearch, riderSearch, DashboardCounterData, buyerSearch } = require('../controllers/searchControllers');
const { protect } = require('../middlewares/authMiddleware');
const router = express.Router();
router.route('/dashboard/count').get(protect, DashboardCounterData);
router.route('/dashboard/users/buyer/lists').get(protect, buyerSearch);
router.route('/dashboard/users/seller/lists').get(protect, sellerSearch)
router.route('/dashboard/users/rider/lists').get(protect, riderSearch)
module.exports = router;