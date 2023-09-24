const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const rateLimit = require('express-rate-limit');
const userRoutes = require('./routes/userRoute');
const eventRoutes = require('./routes/eventRoute');
const { blockIPs } = require('./middlewares/ipFilter');

app.use(blockIPs);
// Define the rate limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 50,                  // Limit each IP to 50 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes'
});

// Apply the rate limiter to all routes
app.use(apiLimiter);

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
