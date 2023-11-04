const Transaction = require('../models/transactionModel');  // Adjust the path as necessary
const User = require('../models/userModel')
const Event = require('../models/eventModel');

const transactionController = {

    // 1) CRUD operations
    // Create
    purchaseTicketTransaction: async (req, res) => {
        try {
            const {
              type,
              card,
              eventID,
              salesRoundID,
              items
            } = req.body;
        
            // Find the event based on eventID
            const event = await Event.findById(eventID);
        
            if (!event) {
              return res.status(404).json({ message: 'Event not found' });
            }
        
            let totalValue = 0;
        
            // Iterate over the items array to calculate the total value
            for (const item of items) {
              const priceID = item.priceID;
              const qty = parseInt(item.qty);
        
              // Find the selected price within the salesRound
              const selectedPrice = event.salesRound.id(salesRoundID).prices.find(price => price._id == priceID);
        
              if (selectedPrice) {
                totalValue += selectedPrice.price * qty;
              }
            }
        
            // Create a new transaction with the calculated total value
            const newTransaction = new Transaction({
              type,
              card,
              value: totalValue
            });
        
            await newTransaction.save();
        
            return res.status(201).json(newTransaction);
          } catch (err) {
            console.error(err);
            return res.status(500).json({ message: err });
          }
    },
    // Delete
    deleteTicketTransaction: async (req, res) => {
        try {
            if (req.user.type != "admin") res.status(403).json({message: "restricted"});

            const deletedTransaction = await Transaction.findByIdAndDelete(req.params.id);
            if (!deletedTransaction) return res.status(404).json({message: "Transaction not found"});
            res.status(200).json({message: "Transaction deleted"});
        } catch (err) {
            res.status(500).json({ message: err.message});
        }
    }
};

module.exports = transactionController;