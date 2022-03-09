const express = require('express');
const { orderAdd,orderGet, orderSearch, adminSeenOrdersSearch, singleOrder } = require('../controllers/OrderControllers');
const { protect } = require('../middlewares/authMiddleware');
const router = express.Router();
router.route("/products/order").post(protect,orderAdd)
router.route("/products/orders").get(protect,orderGet)
router.route("/products/orders/my").get(protect,orderSearch)
router.route("/products/orders/searching").get(protect,adminSeenOrdersSearch);
router.route("/products/orders/singleOrder/:id").get(protect,singleOrder);
module.exports = router;