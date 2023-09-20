require('dotenv').config();
const mongoose = require('mongoose');
const app = require('./app'); // Import the Express app from app.js

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

// Handle database connection errors
db.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

// Handle successful database connection
db.once('open', () => {
  console.log('Connected to MongoDB');
  
  // Start the Express server
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`RT Server is running on port ${port}`);
  });
});
