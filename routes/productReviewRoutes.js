const express = require('express');
const { giveAReview } = require('../controllers/reviewControllers');
const { protect } = require('../middlewares/authMiddleware');
const router = express.Router();
router.route('/products/reviewAdd/:id').put(protect, giveAReview)
module.exports = router;