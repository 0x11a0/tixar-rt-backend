
const express = require('express');
const ticketController = require('../controllers/ticketController');  // Adjust the path as necessary
const router = express.Router();
const {isAuthenticated} = require('../middlewares/auth');


// PUBLIC ROUTE

// 1) Event Operations:
router.route('/generate')
    .post(ticketController.generateTicket);

// PRIVATE ROUTE
router.use(isAuthenticated);

module.exports = router;
