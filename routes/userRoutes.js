const express = require('express');
const { registrationSeller, registrationBuyer, registrationRider, login, profileUpdate, singleUser } = require('../controllers/userControllers');
const { protect } = require('../middlewares/authMiddleware');
const router = express.Router();
router.route('/users/:id').get(protect, singleUser)
router.route('/users').put(protect, profileUpdate)
router.route('/users/login').post(login);
router.route('/users/buyer').post(registrationBuyer);
router.route('/users/seller').post(registrationSeller);
router.route('/users/rider').post(registrationRider);
module.exports = router;