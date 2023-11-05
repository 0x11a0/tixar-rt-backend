const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    artistName: {
        type: String,
    },
    concertDescription: {
        type: String,
    },
    concertImage: {
        type: String,
    },
    categories: [String],
    salesRound: [{
        title: String,
        roundType: String,
        start: Date,
        end: Date,
        allocation: Number,
        prices: [{
            category: String,
            price: Number
        }]
    }],
    sessions: [
        {
            venue: String,
            start: Date,
            end: Date,
            capacity: [{
                category: String,
                capacity: Number,
                available: Number
            }],
        }
    ]
})

const Event = new mongoose.model('Event', eventSchema);
module.exports = Event;