const express = require('express');
const { productSearch, latestProducts, categoriesSearch } = require('../controllers/productSearchControllers');
const router = express.Router();
router.route('/products').get(productSearch);
router.route('/products/latests').get(latestProducts);
router.route('/products/categories').get(categoriesSearch);
module.exports = router;