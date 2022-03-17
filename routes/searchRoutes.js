const express = require('express');
const { DashboardCounterData,searchSellerBuyerRider, searchStatusBySellerRiderBuyer, newSearchSellerRiderBuyer } = require('../controllers/searchControllers');
const { protect } = require('../middlewares/authMiddleware');
const router = express.Router();
router.route('/dashboard/count').get(protect, DashboardCounterData);
router.route('/dashboard/users/role').get(protect, searchSellerBuyerRider);
router.route('/dashboard/users/role/status').get(protect, searchStatusBySellerRiderBuyer);
router.route('/dashboard/users/role/status/latest').get(protect, newSearchSellerRiderBuyer);
module.exports = router;