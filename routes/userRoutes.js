const express = require('express');
const { registrationSeller, registrationBuyer, registrationRider, login, profileUpdate, singleUser, userApproved, userRejected, profileView, userIDLicenseVerify, verifyPhone, NotificationTest, resendOtp, otpVerifyForgetPass, ForgetPassword, changedPassword, resetPassword } = require('../controllers/userControllers');
const { protect } = require('../middlewares/authMiddleware');
const router = express.Router();
router.route('/users').put(protect, profileUpdate).get(protect, profileView)
router.route('/forget-pass').post(protect,ForgetPassword)
router.route('/otp-verify').post(protect,otpVerifyForgetPass)
router.route('/reset-pass').post(protect,resetPassword)
router.route('/change-pass').post(protect,changedPassword)
router.route('/otp/resend').post(protect, resendOtp)
router.route('/users/login').post(login);
router.route('/users/:id').get(protect, singleUser)
router.route('/users/buyer').post(registrationBuyer);
router.route('/users/rider').post(registrationRider);
router.route('/users/seller').post(registrationSeller);
router.route('/users/verify').put(protect, verifyPhone)
router.route('/users/approved/:id').put(protect, userApproved);
router.route('/users/rejected/:id').put(protect, userRejected);
router.route('/users/id/license/verify/:id').put(protect, userIDLicenseVerify);
router.route('/notifications').get(protect, NotificationTest);
module.exports = router;