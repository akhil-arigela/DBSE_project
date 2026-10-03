const express = require('express');
const router = express.Router();
const agentController = require('../controllers/agentController');
const { verifyToken } = require('../middleware/auth');
const { requireRole } = require('../middleware/roleGuard');

router.get('/', agentController.getAllAgents);
router.get('/:id', agentController.getAgent);
router.put('/profile', verifyToken, requireRole('agent'), agentController.updateAgentProfile);

module.exports = router;
