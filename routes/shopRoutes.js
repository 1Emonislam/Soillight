const express = require('express');
const { shopRegister } = require('../controllers/shopControllers');
const { protect } = require('../middlewares/authMiddleware');
const router = express.Router();
router.route('/shop/register').post(protect, shopRegister)
module.exports = router;