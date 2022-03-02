const express = require('express');
const {sellerSearch, riderSearch, DashboardCounterData, buyerSearch, sellerSearchNew, riderSearchNew, sellerSearchApproved, riderSearchApproved } = require('../controllers/searchControllers');
const { protect } = require('../middlewares/authMiddleware');
const router = express.Router();
router.route('/dashboard/count').get(protect, DashboardCounterData);
router.route('/dashboard/users/buyer/lists').get(protect, buyerSearch);
router.route('/dashboard/users/seller/lists').get(protect, sellerSearch)
router.route('/dashboard/users/rider/lists').get(protect, riderSearch);
router.route('/dashboard/users/seller/lists/new').get(protect, sellerSearchNew);
router.route('/dashboard/users/rider/lists/new').get(protect, riderSearchNew);
router.route('/dashboard/users/seller/lists/approved').get(protect, sellerSearchApproved);
router.route('/dashboard/users/rider/lists/approved').get(protect, riderSearchApproved);
module.exports = router;