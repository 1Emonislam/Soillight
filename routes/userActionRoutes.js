const express = require('express');
const { userActionAccount } = require('../controllers/userActionsControllers');
const { protect } = require('../middlewares/authMiddleware');
const router = express.Router();
router.route('/action').put(protect,userActionAccount)
module.exports = router;