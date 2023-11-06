
const express = require('express');
const ticketController = require('../controllers/ticketController');  // Adjust the path as necessary
const router = express.Router();
const {isAuthenticated} = require('../middlewares/auth');


// PRIVATE ROUTE
router.use(isAuthenticated);

// 1) Generate Operations:
router.route('/generate')
    .post(ticketController.generateTicket);

// 2) Get Tickets:
router.route('/')
    .get(ticketController.getUserTickets);

module.exports = router;
