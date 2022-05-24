const express = require('express');
const { giveAReview, reviewUpdate } = require('../controllers/reviewControllers');
const { protect } = require('../middlewares/authMiddleware');
const router = express.Router();
router.route('/products/reviewAdd/:id').put(protect, giveAReview)
router.route('/products/reviewUpdate/:id').put(protect, reviewUpdate)
module.exports = router;