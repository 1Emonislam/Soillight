const express = require('express');
const { singleUser, sellerSearch, riderSearch } = require('../controllers/searchControllers');
const { protect } = require('../middlewares/authMiddleware');
const router = express.Router();
router.route('/:id').get(protect, singleUser)
router.route('/sellers/searching').get(protect, sellerSearch)
router.route('/riderLists/searching').get(protect, riderSearch)
module.exports = router;