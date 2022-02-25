const express = require('express');
const { registrationSeller, registrationBuyer, registrationRider, login, } = require('../controllers/userControllers');
const router = express.Router();
router.route('/users/login').post(login);
router.route('/users/buyer').post(registrationBuyer);
router.route('/users/seller').post(registrationSeller);
router.route('/users/rider').post(registrationRider);
module.exports = router;