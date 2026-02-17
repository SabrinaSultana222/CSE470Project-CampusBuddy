const express = require('express');
const cors = require('cors');
const routes = require('./routes'); // routes/index.js
const cookieParser = require("cookie-parser");


const app = express();

// CORS: allow React frontend (http://localhost:3000) and cookies
app.use(
  cors({
    origin: "http://localhost:3000", // React dev server
    credentials: true,               // allow cookies / Authorization header
  })
);

app.use(express.json());
app.use(cookieParser());


// Base API path
app.use('/api', routes);

// Simple root route
app.get('/', (req, res) => {
  res.send('Campus Buddy backend is running');
});

module.exports = app;
