const express = require('express');
const { getMyNotification } = require('../controllers/notificationControllers');
const { protect } = require('../middlewares/authMiddleware');
const router = express.Router();
router.route('/my-notification').get(protect,getMyNotification);
module.exports = router;