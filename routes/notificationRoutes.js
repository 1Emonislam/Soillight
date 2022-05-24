const express = require('express');
const { getMyNotification, singleNotificationView } = require('../controllers/notificationControllers');
const { protect } = require('../middlewares/authMiddleware');
const router = express.Router();
router.route('/my-notification').get(protect,getMyNotification);
router.route('/notification-view/:id').get(protect,singleNotificationView)
module.exports = router;