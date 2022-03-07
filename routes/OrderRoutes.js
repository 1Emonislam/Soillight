const express = require('express');
const { orderAdd,orderGet, orderSearch } = require('../controllers/OrderControllers');
const { protect } = require('../middlewares/authMiddleware');
const router = express.Router();
router.route("/products/order").post(protect,orderAdd)
router.route("/products/orders").get(protect,orderGet)
router.route("/products/orders/my").get(protect,orderSearch)
module.exports = router;