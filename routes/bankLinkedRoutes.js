const express = require('express');
const { bankLinked, bankLinkedUpdate, bankLinkedRemoved } = require('../controllers/bankLinkedControllers');
const { protect } = require('../middlewares/authMiddleware');
const router = express.Router();
router.route('/bank/linked').post(protect, bankLinked)
router.route('/bank/updated/:id').put(protect, bankLinkedUpdate)
router.route('/bank/removed/:id').delete(protect, bankLinkedRemoved)
module.exports = router;