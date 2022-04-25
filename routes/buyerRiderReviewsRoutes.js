const express = require('express');
const { giveAReviewUser, updateUserReview } = require('../controllers/buyerRiderReviewControllers');
const { protect } = require('../middlewares/authMiddleware');
const router = express.Router();
router.post('/user/give/review/:id', protect, giveAReviewUser);
router.put('/user/give/review', protect, updateUserReview);
module.exports = router;