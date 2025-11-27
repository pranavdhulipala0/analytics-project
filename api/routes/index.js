const express = require('express');
const eventRoutes = require('./events');
const userRoutes = require('./users');

const router = express.Router();

router.use('/events', eventRoutes);
router.use('/users', userRoutes);

router.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;