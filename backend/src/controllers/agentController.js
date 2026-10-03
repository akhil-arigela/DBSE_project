const Agent = require('../models/agentModel');
const User = require('../models/userModel');

exports.getAllAgents = async (req, res, next) => {
  try {
    const agents = await Agent.findAll();
    res.status(200).json({ success: true, data: agents });
  } catch (error) {
    next(error);
  }
};

exports.getAgent = async (req, res, next) => {
  try {
    const agent = await Agent.findById(req.params.id);
    if (!agent) {
      return res.status(404).json({ success: false, message: 'Agent not found' });
    }
    res.status(200).json({ success: true, data: agent });
  } catch (error) {
    next(error);
  }
};

exports.updateAgentProfile = async (req, res, next) => {
  try {
    // Basic logic for updating agent profile
    const agent = await Agent.findByUserId(req.user.user_id);
    if (!agent) {
      return res.status(404).json({ success: false, message: 'Agent not found' });
    }
    // Update logic would go here...
    res.status(200).json({ success: true, message: 'Profile updated' });
  } catch (error) {
    next(error);
  }
};
