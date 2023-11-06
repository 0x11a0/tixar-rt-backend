const Ticket = require('../models/ticketModel');
const Event = require('../models/eventModel');
const Transaction = require('../models/transactionModel');

const ticketController = {

  generateTicket: async (req, res) => {
    try {
      const { transactionId, sessionId, eventId, capacityId, category} = req.body;

      const event = await Event.findById(eventId);

      if (!event) {
        return res.status(404).json({ message: 'Event not found' });
      }

      const transaction = await Transaction.findById(transactionId);

      if (!transaction) {
        return res.status(404).json({ message: 'Transaction not found' });
      }

      const session = event.sessions.id(sessionId);


      const newTicket = new Ticket({ 
        datePurchased : Date.now(),
        type: category,
        transaction: transactionId,
        capacity: capacityId,
        session: sessionId,
        user: req.user._id
        });


      await newTicket.save();

      return res.status(201).json(newTicket);
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },

  getUserTickets: async(req, res) => {
    try {
      const tickets = await Ticket.find({user: req.user._id});

      return res.status(200).json(tickets);
    } catch (err) {
      return res.status(500).json({message: err.message});
    }
  }
}

module.exports = ticketController;