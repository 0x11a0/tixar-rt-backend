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
        event: eventId,
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
      const tickets = await Ticket.find({user: req.user._id}).populate([
        {
            path: 'event', 
            select: 'name artistName artistImage concertDescription concertImage sessions',
        },
        {
            path: 'transaction', 
            populate: {
                path: '_id',
                select: 'code value expiry'
            }
        }
    ]);

    tickets.forEach(ticket => {
      if (ticket.event && ticket.event.sessions) {
        const specificSession = ticket.event.sessions.find(session => session._id.toString() === ticket.session);
        if (specificSession) {
          ticket.event.sessions = specificSession; // Now ticket.event.sessions only contains the specific session
        } else {
          ticket.event.sessions = []; // If the session wasn't found, set to an empty array or handle as needed
        }
      }
    });

      return res.status(200).json(tickets);
    } catch (err) {
      return res.status(500).json({message: err.message});
    }
  }
}

module.exports = ticketController;