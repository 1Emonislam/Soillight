const express = require('express');
const { productCreate, productUpdate, productRemove } = require('../controllers/productControllers');
const { protect } = require('../middlewares/authMiddleware');
const router = express.Router();
router.route('/products/create').post(protect, productCreate);
router.route('/products/update/:id').put(protect, productUpdate)
router.route('/products/remove/:id').delete(protect, productRemove)
module.exports = router;