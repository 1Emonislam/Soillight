const express = require("express");
const { orderAdd,orderSearch, adminSeenOrdersSearch, singleOrder, orderStatusUpdate, orderStatusUpdatedMyHistory, allStatusOrder } = require("../controllers/OrderControllers");
const { protect } = require("../middlewares/authMiddleware");
const router = express.Router();
router.route("/products/order").post(protect, orderAdd);
router.route("/products/orders/my").get(protect, orderSearch);
router.route("/products/orders/query").get(protect, allStatusOrder);
router.route("/products/order/monthly").post(protect, orderAdd);
router.route("/products/orders/history").get(protect, orderStatusUpdatedMyHistory);
router.route("/products/orders/searching").get(protect, adminSeenOrdersSearch);
router.route("/products/order/status/:id").put(protect, orderStatusUpdate)
router.route("/products/orders/singleOrder/:id").get(protect, singleOrder);
module.exports = router;
