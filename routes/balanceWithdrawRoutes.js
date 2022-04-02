const express = require('express');
const { balanceWithdraw, withdrawTransAcction, withdrawStatusByHistory, getWithdrawSingle, myBalanceGet } = require('../controllers/balanceWithdrawControllers');
const { protect } = require('../middlewares/authMiddleware');
const router = express.Router();
router.route('/balance/my').get(protect,myBalanceGet)
router.route('/balance/withdraw').post(protect, balanceWithdraw);
router.route('/balance/withdraw/:id').get(protect,getWithdrawSingle)
router.route('/balance/withdraw/status/:id').put(protect, withdrawTransAcction);
router.route('/balance/withdraw/status/history').get(protect,withdrawStatusByHistory)
module.exports = router;