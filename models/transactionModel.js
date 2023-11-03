const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    type: {
        String,
        required: true,
    },
    card: {
        cardName: String,
        cardNumber: String,
        cardExpiryMonth: String,
        cardExpiryYear: String,
        cardCvv: String
    },
})

const Transaction = new mongoose.model('Transaction', transactionSchema);
module.exports = Transaction;