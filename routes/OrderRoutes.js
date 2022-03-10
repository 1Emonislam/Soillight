const express = require('express');
const { orderAdd,orderGet, orderSearch, adminSeenOrdersSearch, singleOrder, orderCompeleteToBlanceAdd, orderPendingToBalanceSub,  } = require('../controllers/OrderControllers');
const { protect } = require('../middlewares/authMiddleware');
const router = express.Router();
router.route("/products/order").post(protect,orderAdd)
router.route("/products/orders").get(protect,orderGet)
router.route("/products/orders/my").get(protect,orderSearch)
router.route("/products/orders/searching").get(protect,adminSeenOrdersSearch);
router.route("/products/orders/singleOrder/:id").get(protect,singleOrder);
router.route("/products/orders/complete/:id").put(protect,orderCompeleteToBlanceAdd);
router.route("/products/orders/pending/:id").put(protect,orderPendingToBalanceSub);
module.exports = router;