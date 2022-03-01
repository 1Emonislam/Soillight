const express = require('express');
const { registrationSeller, registrationBuyer, registrationRider, login, profileUpdate, userCounter, } = require('../controllers/userControllers');
const { protect } = require('../middlewares/authMiddleware');
const router = express.Router();
router.route('/users').put(protect, profileUpdate)
router.route('/users/login').post(login);
router.route('/users/buyer').post(registrationBuyer);
router.route('/users/seller').post(registrationSeller);
router.route('/users/rider').post(registrationRider);
router.route('/users/count').get(protect,userCounter)
module.exports = router;