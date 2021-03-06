const express = require('express');
const { shopRegister, updateShop, shopRemove, myShop } = require('../controllers/shopControllers');
const { protect } = require('../middlewares/authMiddleware');
const router = express.Router();
router.route('/shop/my').get(protect,myShop)
router.route('/shop/remove/:id').delete(protect, shopRemove);
router.route('/shop/register').post(protect, shopRegister);
router.route('/shop/update/:id').put(protect, updateShop);
router.route('/shop/remove/:id').delete(protect, shopRemove);
module.exports = router;