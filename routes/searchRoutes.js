const express = require('express');
const { DashboardCounterData,searchSellerBuyerRider, searchStatusBySellerRiderBuyer } = require('../controllers/searchControllers');
const { protect } = require('../middlewares/authMiddleware');
const router = express.Router();
router.route('/dashboard/count').get(protect, DashboardCounterData);
router.route('/dashboard/users/role').get(protect, searchSellerBuyerRider);
router.route('/dashboard/users/role/status').get(protect, searchStatusBySellerRiderBuyer);
router.route('/dashboard/users/role/status/latest').get(protect, searchStatusBySellerRiderBuyer);
module.exports = router;