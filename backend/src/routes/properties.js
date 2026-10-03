const express = require('express');
const router = express.Router();
const propertyController = require('../controllers/propertyController');
const { verifyToken } = require('../middleware/auth');
const { requireRole } = require('../middleware/roleGuard');

router.get('/', propertyController.getProperties);
router.get('/my/listings', verifyToken, requireRole('seller', 'agent'), propertyController.getMyProperties);
router.get('/:id', propertyController.getProperty);
router.post('/', verifyToken, requireRole('seller', 'agent'), propertyController.createProperty);
router.put('/:id', verifyToken, requireRole('seller', 'agent'), propertyController.updateProperty);
router.delete('/:id', verifyToken, requireRole('seller', 'agent'), propertyController.deleteProperty);

module.exports = router;
