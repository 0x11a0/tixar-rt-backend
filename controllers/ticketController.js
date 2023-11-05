const Ticket = require('../models/ticketModel');
const Event = require('../models/eventModel');

const ticketController = {

  generateTicket: async (req, res) => {
    try {
      const { type, transactionID, priceId, salesRoundID, eventId } = req.body;

      const event = await Event.findById(eventId);
      const price = event.salesRound.id(salesRoundID).prices.find(price => price._id == priceID);

      res.status(201).json(price);

      // const newTicket = new Ticket({ 
      //   datePurchased : Date.now(),
      //   type: type,
      //   transaction: transactionId,
      //   price: price
      //   });

      // await newTicket.save();

      // res.status(201).json(newTicket);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
}

module.exports = ticketController;