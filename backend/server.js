const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const apiRoutes = require('./routes/api');
app.use('/api', apiRoutes);

// Test route
app.get('/', (req, res) => {
    res.send('Screen Time Management API is running...');
});

app.get('/blocked', (req, res) => {
    res.send('<h1>Blocked: Limit Exceeded</h1><p>You have reached your screen time limit.</p>');
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});