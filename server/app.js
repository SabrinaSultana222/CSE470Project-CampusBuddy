const express = require('express');
const cors = require('cors');
const routes = require('./routes'); // routes/index.js

const app = express();

app.use(cors());
app.use(express.json());

// Base API path
app.use('/api', routes);

// Simple root route
app.get('/', (req, res) => {
  res.send('Campus Buddy backend is running');
});

module.exports = app;
