// app.js

const express = require('express');
const app = express();

// Middlewares
app.use(express.json()); // for parsing application/json

// Sample route
app.get('/', (req, res) => {
    res.send('TIXAR.SG');
});

module.exports = app;
