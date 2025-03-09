// filepath: /Users/brandonoleson/Documents/Developer/walkthrough-website/video-game-walkthroughs/backend/models/Guide.js
const mongoose = require('mongoose');

const GuideSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    videoUrl: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model('Guide', GuideSchema);