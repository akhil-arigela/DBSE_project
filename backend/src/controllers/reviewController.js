const Review = require('../models/reviewModel');
const Agent = require('../models/agentModel');

exports.createReview = async (req, res, next) => {
  try {
    const reviewData = { ...req.body, reviewer_id: req.user.user_id };
    const reviewId = await Review.create(reviewData);

    if (reviewData.agent_id) {
      await Agent.updateRating(reviewData.agent_id);
    }

    res.status(201).json({ success: true, message: 'Review created', data: { review_id: reviewId } });
  } catch (error) {
    next(error);
  }
};

exports.getPropertyReviews = async (req, res, next) => {
  try {
    const reviews = await Review.findByProperty(req.params.propertyId);
    res.status(200).json({ success: true, data: reviews });
  } catch (error) {
    next(error);
  }
};

exports.getAgentReviews = async (req, res, next) => {
  try {
    const reviews = await Review.findByAgent(req.params.agentId);
    res.status(200).json({ success: true, data: reviews });
  } catch (error) {
    next(error);
  }
};
