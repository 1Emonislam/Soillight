const express = require('express');
const { Order } = require('../controllers/OrderControllers');
const { protect } = require('../middlewares/authMiddleware');
const router = express.Router();
router.route("/order").post(protect,Order)
module.exports = router;