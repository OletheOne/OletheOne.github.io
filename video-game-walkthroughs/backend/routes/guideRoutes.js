// filepath: /Users/brandonoleson/Documents/Developer/walkthrough-website/video-game-walkthroughs/backend/routes/guideRoutes.js
const express = require('express');
const router = express.Router();
const guideController = require('../controllers/guideController');

router.get('/', guideController.getGuides);
router.get('/:id', guideController.getGuideById);
router.post('/', guideController.createGuide);
router.put('/:id', guideController.updateGuide);
router.delete('/:id', guideController.deleteGuide);

module.exports = router;