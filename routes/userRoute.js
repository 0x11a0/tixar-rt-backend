const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController'); // Replace with the actual path to your userController file
const { isAuthenticated } = require('../middlewares/auth');

// PUBLIC ROUTE
// Register user
router.post('/register', userController.register);

// Request OTP
router.post('/otp/request', userController.requestOtp);

// Telebot Callback
router.post('/telebot/callback', userController.telebotCallback);

// Login with OTP
router.post('/login', userController.login);

// TEMP BYPASS LOGIN
router.post('/bypass', userController.bypassLogin); // REMOVE WHEN DONE

// PRIVATE ROUTE
router.use(isAuthenticated);

// Add credit card
router.post('/user/card', userController.addCreditCard);

// Update credit card
router.put('/user/card', userController.updateCreditCard); // Using PUT since it's an update operation

// Update user name (firstName & lastName)
router.put('/user/name', userController.updateName); // Using PUT since it's an update operation

// Get User Profile
router.get('/user', userController.getProfile);

// Update User Profile
router.put('/user', userController.updateProfile); // USING put since it's an update operation

// Get User eWallet Balance
router.get('/user/eWalletBalance', userController.getEWalletBalance);

module.exports = router;
