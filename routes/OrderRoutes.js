const express = require('express');
const { orderAdd } = require('../controllers/OrderControllers');
const { protect } = require('../middlewares/authMiddleware');
const router = express.Router();
router.route("products/order").post(protect,orderAdd)
module.exports = router;