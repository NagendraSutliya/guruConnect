const express = require('express');
const router = express.Router();
const { updateCMSSection, getCMSSection } = require('../controllers/cmsController');
const { requireAuth, requireAdmin } = require('../middleware/auth');

// Public route to get website content
router.get('/:section', getCMSSection);

// Protected routes to update website content
router.post('/update', requireAuth, requireAdmin, updateCMSSection);

module.exports = router;
