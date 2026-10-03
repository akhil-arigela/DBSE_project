const Media = require('../models/mediaModel');
const Property = require('../models/propertyModel');

exports.uploadMedia = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const { property_id, media_type, is_primary } = req.body;
    if (!property_id) {
      return res.status(400).json({ success: false, message: 'property_id is required' });
    }

    const url = `http://localhost:5000/uploads/${req.file.filename}`;

    const mediaId = await Media.create({
      property_id: parseInt(property_id),
      url,
      filename: req.file.filename,
      media_type: media_type || 'photo',
      is_primary: is_primary === 'true' || is_primary === true
    });

    if (media_type === 'virtual_tour_360') {
      await Property.update(property_id, { has_virtual_tour: true });
    }

    res.status(201).json({
      success: true,
      message: 'Media uploaded successfully',
      data: { media_id: mediaId, url, filename: req.file.filename }
    });
  } catch (error) {
    next(error);
  }
};

exports.getPropertyMedia = async (req, res, next) => {
  try {
    const media = await Media.findByProperty(req.params.propertyId);
    res.status(200).json({ success: true, data: media });
  } catch (error) {
    next(error);
  }
};

exports.deleteMedia = async (req, res, next) => {
  try {
    const deleted = await Media.deleteById(req.params.mediaId);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Media not found' });
    }
    res.status(200).json({ success: true, message: 'Media deleted successfully' });
  } catch (error) {
    next(error);
  }
};

exports.setPrimary = async (req, res, next) => {
  try {
    const { property_id } = req.body;
    const updated = await Media.setPrimary(req.params.mediaId, property_id);
    res.status(200).json({ success: true, message: 'Primary media set successfully', data: updated });
  } catch (error) {
    next(error);
  }
};
