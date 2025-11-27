const express = require('express');
const { trackEvent, getEvents, getEventStats } = require('../controllers/eventController');
const { validateTrackEvent } = require('../middleware/validation');

const router = express.Router();

router.post('/track', validateTrackEvent, trackEvent);

router.get('/', getEvents);

router.get('/stats', getEventStats);

module.exports = router;