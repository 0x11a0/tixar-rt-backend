require('dotenv').config('../');
const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  datePurchased: Date,
  type: String,
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event'
  },
  session: String,
  transaction: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Transaction'
  },
  capacity: String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
})

const Ticket = mongoose.model('Ticket', ticketSchema);
module.exports = Ticket;