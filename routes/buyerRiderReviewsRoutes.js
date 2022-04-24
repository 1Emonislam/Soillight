const express = require('express');
const { protect } = require('../middlewares/authMiddleware');
const router = express.Router();
router.post('/buyer/reviews', protect);
router.post('/seller/reviews', protect);
router.put('/buyer/reviews', protect);
router.put('/seller/reviews', protect);
module.exports = router;