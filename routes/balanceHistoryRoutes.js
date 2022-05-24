const express = require('express');
const { protect } = require('../middlewares/authMiddleware');
const router = express.Router();
router.route('/balance/history/push').post(protect)
module.exports = router;