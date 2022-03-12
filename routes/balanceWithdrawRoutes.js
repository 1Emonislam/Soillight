const express = require('express');
const { balanceWithdraw } = require('../controllers/balanceWithdrawControllers');
const { protect } = require('../middlewares/authMiddleware');
const router = express.Router();
router.route('/balance/withdraw').post(protect,balanceWithdraw);
module.exports = router;