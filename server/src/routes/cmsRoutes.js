const express = require('express');
const router = express.Router();
const { updateCMSSection, getCMSSection, getAllCMSStatus, toggleCMSSection } = require('../controllers/cmsController');
const { requireAuth, requireAdmin } = require('../middleware/auth');

// Public route to get website content
router.get('/all-status', getAllCMSStatus);
router.get('/:section', getCMSSection);

// Protected routes to update website content
router.post('/update', requireAuth, requireAdmin, updateCMSSection);
router.post('/toggle/:section', requireAuth, requireAdmin, toggleCMSSection);

module.exports = router;
