require('dotenv').config('../');
const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  datePurchased: Date,
  type: String,
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event'
  },
  session: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Session'
  },
  transaction: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Transaction'
  },
  price: Number
})

const Ticket = mongoose.model('Ticket', ticketSchema);
module.exports = Ticket;