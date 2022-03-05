const express = require('express');
const { productSearch, latestProducts, categoriesSearch, myProducts } = require('../controllers/productSearchControllers');
const { protect } = require('../middlewares/authMiddleware');
const router = express.Router();
router.route('/products').get(productSearch);
router.route('/products/my').get(protect,myProducts);
router.route('/products/latests').get(latestProducts);
router.route('/products/categories').get(categoriesSearch);
module.exports = router;