const express = require("express");
const {addProductToCart } = require("../controllers/cartControllers");
const { protect } = require("../middlewares/authMiddleware");
const router = express.Router();
router.route("products/add-to-cart").post(protect,addProductToCart)
module.exports = router;