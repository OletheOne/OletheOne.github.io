// filepath: /Users/brandonoleson/Documents/Developer/walkthrough-website/video-game-walkthroughs/backend/app.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const connectDB = require('./config/db');
const guideRoutes = require('./routes/guideRoutes');

const app = express();

// Connect to database
connectDB();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api/guides', guideRoutes);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});