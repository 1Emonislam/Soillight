const express = require('express');
const { registrationSeller, registrationBuyer, registrationRider, login, profileUpdate, singleUser, userApproved, userRejected, changePassword } = require('../controllers/userControllers');
const { protect } = require('../middlewares/authMiddleware');
const router = express.Router();
router.route('/users').put(protect, profileUpdate)
router.route('/users/login').post(login);
router.route('/users/:id').get(protect, singleUser)              
router.route('/users/buyer').post(registrationBuyer);
router.route('/users/seller').post(registrationSeller);
router.route('/users/change-password').put(protect,changePassword);
router.route('/users/rider').post(registrationRider);
router.route('/users/approved/:id').put(protect, userApproved);
router.route('/users/rejected/:id').put(protect, userRejected);
module.exports = router;