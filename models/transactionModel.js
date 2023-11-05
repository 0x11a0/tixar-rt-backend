const mongoose = require('mongoose');
const transactionSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true,
    },
    card: {
        cardName: String,
        cardNumber: String,
        cardExpiryMonth: String,
        cardExpiryYear: String,
        cardCvv: String,
    },
    value: {
        type: Number,
        required: true,
    }
})
const Transaction = new mongoose.model('Transaction', transactionSchema);
module.exports = Transaction;