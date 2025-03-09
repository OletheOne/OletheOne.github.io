// filepath: /Users/brandonoleson/Documents/Developer/walkthrough-website/video-game-walkthroughs/backend/controllers/guideController.js
const Guide = require('../models/Guide');

// Get all guides
exports.getGuides = async (req, res) => {
    try {
        const guides = await Guide.find();
        res.json(guides);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a single guide by ID
exports.getGuideById = async (req, res) => {
    try {
        const guide = await Guide.findById(req.params.id);
        if (!guide) {
            return res.status(404).json({ message: 'Guide not found' });
        }
        res.json(guide);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create a new guide
exports.createGuide = async (req, res) => {
    const { title, content, videoUrl } = req.body;
    try {
        const newGuide = new Guide({ title, content, videoUrl });
        await newGuide.save();
        res.status(201).json(newGuide);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update an existing guide
exports.updateGuide = async (req, res) => {
    const { title, content, videoUrl } = req.body;
    try {
        const guide = await Guide.findById(req.params.id);
        if (!guide) {
            return res.status(404).json({ message: 'Guide not found' });
        }
        guide.title = title;
        guide.content = content;
        guide.videoUrl = videoUrl;
        await guide.save();
        res.json(guide);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete a guide
exports.deleteGuide = async (req, res) => {
    try {
        const guide = await Guide.findById(req.params.id);
        if (!guide) {
            return res.status(404).json({ message: 'Guide not found' });
        }
        await guide.remove();
        res.json({ message: 'Guide removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};