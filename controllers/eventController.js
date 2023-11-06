const Event = require('../models/eventModel');  // Adjust the path as necessary

const eventController = {

    // 1) Event Operations:
    getAllEvents: async (req, res) => {
        try {
            const events = await Event.find().sort({ "sessions.start":1});
            res.status(200).json(events);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },

    getEventById: async (req, res) => {
        try {
            const event = await Event.findById(req.params.id);
            if (!event) return res.status(404).json({ message: "Event not found" });
            res.status(200).json(event);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },

    createEvent: async (req, res) => {
        try {
            // ADMIN ONLY
            if (req.user.type != "admin") res.status(403).json({message: "restricted"});

            var artistImage = null;
            var concertImage = null;
            if (req.files) {
                if (req.files['artistImage']) {
                  artistImage = req.files['artistImage'][0].location;
                }
          
                if (req.files['concertImage']) {
                  concertImage = req.files['concertImage'][0].location;
                }
              }

            
            const name = req.body.name;
            const artistName = req.body.artistName;
            const concertDescription = req.body.concertDescription;
            const categories = req.body.categories;
            const salesRound = req.body.salesRound;
            const sessions = req.body.sessions;
            console.log(categories);

            const newEvent = new Event(
                {
                    "name": name,
                    "artistName": artistName,
                    "artistImage": artistImage,
                    "concertDescription": concertDescription,
                    "concertImage": concertImage,
                    "categories": categories,
                    "salesRound": salesRound,
                    "sessions": sessions,
                });
            await newEvent.save();
            res.status(201).json(newEvent);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },

    updateEvent: async (req, res) => {
        try {
            // ADMIN ONLY
            if (req.user.type != "admin") res.status(403).json({message: "restricted"});

            var artistImage = null;
            var concertImage = null;
            if (req.files) {
                if (req.files['artistImage']) {
                  artistImage = req.files['artistImage'][0].location;
                }
          
                if (req.files['concertImage']) {
                  concertImage = req.files['concertImage'][0].location;
                }
            }

              const name = req.body.name;
              const artistName = req.body.artistName;
              const concertDescription = req.body.concertDescription;
              const categories = req.body.categories;
              const salesRound = req.body.salesRound;
              const sessions = req.body.sessions;
  
              const updateEvent = 
                  {
                      "name": name,
                      "artistName": artistName,
                      "artistImage": artistImage,
                      "concertDescription": concertDescription,
                      "concertImage": concertImage,
                      "categories": categories,
                      "salesRound": salesRound,
                      "sessions": sessions,
                  };
                  console.log(updateEvent);
            const updatedEvent = await Event.findByIdAndUpdate(req.params.id, updateEvent, { new: true });
            if (!updatedEvent) return res.status(404).json({ message: "Event not found" });
            res.status(200).json(updatedEvent);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },

    deleteEvent: async (req, res) => {
        try {
            // ADMIN ONLY
            if (req.user.type != "admin") res.status(403).json({message: "restricted"});

            const deletedEvent = await Event.findByIdAndDelete(req.params.id);
            if (!deletedEvent) return res.status(404).json({ message: "Event not found" });
            res.status(200).json({ message: "Event deleted" });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },

    // 2) SalesRound Operations:
    getCurrentSalesRound: async(req, res) => {
        try {
            const now = new Date();
    
            // Query events where at least one salesRound is currently ongoing
            const events = await Event.find({
                "salesRound": {
                    $elemMatch: {
                        start: { $lte: now },
                        end: { $gte: now }
                    }
                }
            }).select('salesRound');  // Only get salesRound array from each event
    
            // Extract current sales rounds from the events
            const currentSalesRounds = events.map(event => 
                event.salesRound.filter(round => 
                    round.start <= now && round.end >= now
                )
            ).flat();
    
            res.status(200).json(currentSalesRounds);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching current sales rounds', error });
        }
    },
    
    getAllSalesRounds: async (req, res) => {
        try {
            // ADMIN ONLY
            if (req.user.type != "admin") res.status(403).json({message: "restricted"});

            const event = await Event.findById(req.params.eventId);
            if (!event) return res.status(404).json({ message: "Event not found" });
            res.status(200).json(event.salesRound);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },

    getSalesRoundById: async (req, res) => {
        try {
            // ADMIN ONLY
            if (req.user.type != "admin") res.status(403).json({message: "restricted"});

            const event = await Event.findById(req.params.eventId);
            if (!event) return res.status(404).json({ message: "Event not found" });

            const salesRound = event.salesRound.id(req.params.salesRoundId);
            if (!salesRound) return res.status(404).json({ message: "Sales Round not found" });

            res.status(200).json(salesRound);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },

    createSalesRound: async (req, res) => {
        try {
            // ADMIN ONLY
            if (req.user.type != "admin") res.status(403).json({message: "restricted"});

            const event = await Event.findByIdAndUpdate(req.params.eventId, {
                $push: { salesRound: req.body }
            }, { new: true });

            if (!event) return res.status(404).json({ message: "Event not found" });
            res.status(201).json(event);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },

    updateSalesRound: async (req, res) => {
        try {
            // ADMIN ONLY
            if (req.user.type != "admin") res.status(403).json({message: "restricted"});

            const event = await Event.findOneAndUpdate(
                { "_id": req.params.eventId, "salesRound._id": req.params.salesRoundId },
                { "$set": { "salesRound.$": req.body } },
                { new: true }
            );

            if (!event) return res.status(404).json({ message: "Sales Round not found" });
            res.status(200).json(event);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },

    deleteSalesRound: async (req, res) => {
        try {
            // ADMIN ONLY
            if (req.user.type != "admin") res.status(403).json({message: "restricted"});

            const event = await Event.findByIdAndUpdate(req.params.eventId, {
                $pull: { salesRound: { _id: req.params.salesRoundId } }
            }, { new: true });

            if (!event) return res.status(404).json({ message: "Event not found" });
            res.status(200).json({ message: "Sales Round deleted" });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },

    // 3) Prices in Sales Round Operations:
    addPriceToSalesRound: async (req, res) => {
        try {
            // ADMIN ONLY
            if (req.user.type != "admin") res.status(403).json({message: "restricted"});

            const event = await Event.findOneAndUpdate(
                { "_id": req.params.eventId, "salesRound._id": req.params.salesRoundId },
                { "$push": { "salesRound.$.prices": req.body } },
                { new: true }
            );

            if (!event) return res.status(404).json({ message: "Event or Sales Round not found" });
            res.status(201).json({ message: "Price added to Sales Round" });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },

    updatePriceInSalesRound: async (req, res) => {
        try {
            // ADMIN ONLY
            if (req.user.type != "admin") res.status(403).json({message: "restricted"});

            const event = await Event.findOne({
                "_id": req.params.eventId,
                "salesRound._id": req.params.salesRoundId,
                "salesRound.prices.category": req.params.category
            });
            
            if (!event) return res.status(404).json({ message: "Event, Sales Round, or Price Category not found" });

            const salesRound = event.salesRound.id(req.params.salesRoundId);
            const price = salesRound.prices.find(p => p.category === req.params.category);
            price.price = req.body.price;

            await event.save();
            res.status(200).json({ message: "Price updated in Sales Round" });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },

    deletePriceFromSalesRound: async (req, res) => {
        try {
            // ADMIN ONLY
            if (req.user.type != "admin") res.status(403).json({message: "restricted"});
            
            const event = await Event.findOneAndUpdate(
                { "_id": req.params.eventId, "salesRound._id": req.params.salesRoundId },
                { "$pull": { "salesRound.$.prices": { category: req.params.category } } },
                { new: true }
            );

            if (!event) return res.status(404).json({ message: "Event, Sales Round, or Price Category not found" });
            res.status(200).json({ message: "Price deleted from Sales Round" });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },


    // 4) Sessions Operations:
    getAllSessions: async (req, res) => {
        try {
            const event = await Event.findById(req.params.eventId);
            if (!event) return res.status(404).json({ message: "Event not found" });

            res.status(200).json(event.sessions);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },

    getSessionById: async (req, res) => {
        try {
            const event = await Event.findOne({ "_id": req.params.eventId, "sessions._id": req.params.sessionId },
                { "sessions.$": 1 }
            );

            if (!event || !event.sessions.length) return res.status(404).json({ message: "Event or Session not found" });

            res.status(200).json(event.sessions[0]);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },

    addSession: async (req, res) => {
        try {
            // ADMIN ONLY
            if (req.user.type != "admin") res.status(403).json({message: "restricted"});

            const event = await Event.findByIdAndUpdate(
                req.params.eventId,
                { "$push": { "sessions": req.body } },
                { new: true }
            );

            if (!event) return res.status(404).json({ message: "Event not found" });

            res.status(201).json({ message: "Session added", session: event.sessions[event.sessions.length - 1] });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },

    updateSession: async (req, res) => {
        try {
            // ADMIN ONLY
            if (req.user.type != "admin") res.status(403).json({message: "restricted"});

            const event = await Event.findOneAndUpdate(
                { "_id": req.params.eventId, "sessions._id": req.params.sessionId },
                { "$set": { "sessions.$": req.body } },
                { new: true }
            );

            if (!event) return res.status(404).json({ message: "Event or Session not found" });

            const updatedSession = event.sessions.id(req.params.sessionId);
            res.status(200).json({ message: "Session updated", session: updatedSession });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },

    deleteSession: async (req, res) => {
        try {
            // ADMIN ONLY
            if (req.user.type != "admin") res.status(403).json({message: "restricted"});

            const event = await Event.findOneAndUpdate(
                { "_id": req.params.eventId },
                { "$pull": { "sessions": { "_id": req.params.sessionId } } },
                { new: true }
            );

            if (!event) return res.status(404).json({ message: "Event or Session not found" });
            res.status(200).json({ message: "Session deleted" });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },

    // 5) categoryCapacity in Sales Round Operations:
    addCategoryCapacity: async (req, res) => {
        try {
            // ADMIN ONLY
            if (req.user.type != "admin") res.status(403).json({message: "restricted"});

            const event = await Event.findOneAndUpdate(
                { "_id": req.params.eventId, "sessions._id": req.params.sessionId },
                { "$push": { "sessions.$.categoryCapacity": req.body } },
                { new: true }
            );

            if (!event) return res.status(404).json({ message: "Event or Session not found" });
            
            const updatedSession = event.sessions.id(req.params.sessionId);
            res.status(201).json({ message: "CategoryCapacity added", categoryCapacity: updatedSession.categoryCapacity.slice(-1)[0] });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },

    updateCategoryCapacity: async (req, res) => {
        try {
            // ADMIN ONLY
            if (req.user.type != "admin") res.status(403).json({message: "restricted"});

            const sessionField = "sessions.$.categoryCapacity." + req.params.categoryIndex;
            const event = await Event.findOneAndUpdate(
                { "_id": req.params.eventId, "sessions._id": req.params.sessionId },
                { "$set": { [sessionField]: req.body } },
                { new: true }
            );

            if (!event) return res.status(404).json({ message: "Event, Session, or CategoryCapacity not found" });
            
            const updatedSession = event.sessions.id(req.params.sessionId);
            res.status(200).json({ message: "CategoryCapacity updated", categoryCapacity: updatedSession.categoryCapacity[req.params.categoryIndex] });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },

    deleteCategoryCapacity: async (req, res) => {
        try {
            // ADMIN ONLY
            if (req.user.type != "admin") res.status(403).json({message: "restricted"});

            const event = await Event.findOneAndUpdate(
                { "_id": req.params.eventId, "sessions._id": req.params.sessionId },
                { "$pull": { "sessions.$.categoryCapacity": { "category": req.params.category } } },
                { new: true }
            );

            if (!event) return res.status(404).json({ message: "Event, Session, or CategoryCapacity not found" });
            res.status(200).json({ message: "CategoryCapacity deleted" });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },

};

module.exports = eventController;