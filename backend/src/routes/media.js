const express = require('express');
const router = express.Router();
const mediaController = require('../controllers/mediaController');
const { verifyToken } = require('../middleware/auth');
const { requireRole } = require('../middleware/roleGuard');
const upload = require('../config/multer');

router.post('/upload', verifyToken, requireRole('seller', 'agent'), upload.single('media'), mediaController.uploadMedia);
router.get('/:propertyId', mediaController.getPropertyMedia);
router.delete('/:mediaId', verifyToken, requireRole('seller', 'agent'), mediaController.deleteMedia);
router.put('/:mediaId/primary', verifyToken, requireRole('seller', 'agent'), mediaController.setPrimary);

module.exports = router;
