const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { verifyToken } = require('../middleware/auth');
const { requireRole } = require('../middleware/roleGuard');

router.post('/', verifyToken, requireRole('buyer'), reviewController.createReview);
router.get('/property/:propertyId', reviewController.getPropertyReviews);
router.get('/agent/:agentId', reviewController.getAgentReviews);

module.exports = router;
