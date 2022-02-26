const express = require('express');
const { productCreate } = require('../controllers/productControllers');
const { protect } = require('../middlewares/authMiddleware');
const router = express.Router();
router.route('/products/create').post(protect, productCreate);
// router.route('/')
module.exports = router;