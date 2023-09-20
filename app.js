const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const userRoutes = require('./routes/userRoute');
const eventRoutes = require('./routes/eventRoute');

// Middleware to parse JSON request bodies
app.use(bodyParser.json());

// Define routes
app.use('/api', userRoutes); 
app.use('/api/event', eventRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

module.exports = app; // Export the Express app
