const express = require('express');
const { balanceWithdraw, withdrawTransAcction } = require('../controllers/balanceWithdrawControllers');
const { protect } = require('../middlewares/authMiddleware');
const router = express.Router();
router.route('/balance/withdraw').post(protect, balanceWithdraw);
router.route('/balance/withdraw/status').put(protect, withdrawTransAcction);
module.exports = router;