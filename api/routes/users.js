const express = require('express');
const { getUsers, getUserProfile, getUserStats } = require('../controllers/userController');

const router = express.Router();

router.get('/', getUsers);

router.get('/stats', getUserStats);

router.get('/:user_id', getUserProfile);

module.exports = router;