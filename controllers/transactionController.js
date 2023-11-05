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

            const user = req.user._id;
            const userBalance = req.user.eWalletBalance;
            if (!userBalance) return res.status(400).json({message: "User has no balance"});
        
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
        
            // Check if user has enough balance
            if (userBalance < totalValue) return res.status(400).json({message: "Not enough balance"});
            // Create a new transaction with the calculated total value
            const newTransaction = new Transaction({
              type,
              card,
              value: totalValue
            });
        
            await newTransaction.save();

            // Deduct from user's eWallet balance
            const newBalance = userBalance - totalValue;
            await User.findByIdAndUpdate(user, { eWalletBalance: newBalance });
        
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
    },

    //eWalletTopUp
    topUpEWalletBalance: async (req, res) => {
        try {

            const type = req.body.type;
            if (!(type == "eWalletTopUp")) return res.status(400).json({message: "Wrong type"});

            const user = req.user._id;
            if (!user) return res.status(404).json({message: "User not found!"});

            const addEWalletValue = parseInt(req.body.value);
            let eWalletBalance = parseInt(req.user.eWalletBalance);
            eWalletBalance += addEWalletValue;

            const eWalletTransaction = new Transaction(req.body);
            await User.findByIdAndUpdate(user, { eWalletBalance: eWalletBalance });
            await eWalletTransaction.save();
            return res.status(201).json({message: "Added $" + addEWalletValue + " to your account!"});
        } catch (err) {
            res.status(500).json({message: err.message});
        }
    }, 

    withdrawEWalletBalance: async (req, res) => {
        try {
          const type = req.body.type;
          if (!(type == "eWalletWithdraw")) return res.status(400).json({message: "Wrong type"});

          const user = req.user._id;
          if (!user) return res.status(404).json({message: "User not found!"});

          const withdrawEWalletValue = parseInt(req.body.value);
          let eWalletBalance = parseInt(req.user.eWalletBalance);

          // Check if user has enough to withdraw
          let eWalletRemainder = eWalletBalance - withdrawEWalletValue;
          // if user's balance < the value the user wants to draw && the remainder after withdrawing is < 0
          if (!(eWalletBalance >= withdrawEWalletValue && eWalletRemainder >= 0)) return res.status(400).json({message: "Not enough balance"});

          const eWalletTransaction = new Transaction(req.body);
          await User.findByIdAndUpdate(user, { eWalletBalance: eWalletRemainder });
          await eWalletTransaction.save();
          return res.status(201).json({message: "Withdrawn $" + withdrawEWalletValue + " from your account!"});

        } catch (err) {
          res.status(500).json({message: err.message});
        }
    },
};

module.exports = transactionController;