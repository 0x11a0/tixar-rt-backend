
const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController'); // Replace with the actual path to your userController file
const { isAuthenticated } = require('../middlewares/auth');

// PRIVATE ROUTE
router.use(isAuthenticated);

// Purchase Ticket
router.route('/purchaseTicket')
    .post(transactionController.purchaseTicketTransaction);

router.route('/topUpEWallet')
    .post(transactionController.topUpEWalletBalance);

router.route('/withdrawEWallet')
    .post(transactionController.withdrawEWalletBalance);

router.route('/:id')
    .delete(transactionController.deleteTicketTransaction);

module.exports = router;