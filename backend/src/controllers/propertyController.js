const Property = require('../models/propertyModel');

exports.getProperties = async (req, res, next) => {
  try {
    const filters = req.query;
    const limit  = Math.min(parseInt(filters.limit) || 12, 50);
    const page   = Math.max(parseInt(filters.page)  || 1, 1);

    const [properties, total] = await Promise.all([
      Property.findAll(filters),
      Property.countAll(filters)
    ]);

    res.status(200).json({
      success: true,
      data: properties,
      pagination: {
        totalItems:  total,
        currentPage: page,
        totalPages:  Math.ceil(total / limit),
        limit
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.getProperty = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }
    res.status(200).json({ success: true, data: property });
  } catch (error) {
    next(error);
  }
};

exports.createProperty = async (req, res, next) => {
  try {
    const { amenities, ...propertyData } = req.body;
    propertyData.seller_id = req.user.user_id;

    const propertyId = await Property.create(propertyData);

    // Insert amenities if provided
    if (amenities && Array.isArray(amenities) && amenities.length > 0) {
      const db = require('../config/db');
      const values = amenities.map(id => [propertyId, id]);
      await db.query('INSERT IGNORE INTO property_amenities (property_id, amenity_id) VALUES ?', [values]);
    }

    res.status(201).json({ success: true, message: 'Property created successfully', data: { property_id: propertyId } });
  } catch (error) {
    next(error);
  }
};

exports.updateProperty = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }
    if (property.seller_id !== req.user.user_id && req.user.role === 'buyer') {
      return res.status(403).json({ success: false, message: 'Not authorized to update this property' });
    }
    await Property.update(req.params.id, req.body);
    res.status(200).json({ success: true, message: 'Property updated successfully' });
  } catch (error) {
    next(error);
  }
};

exports.deleteProperty = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }
    if (property.seller_id !== req.user.user_id && req.user.role === 'buyer') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    await Property.softDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Property removed successfully' });
  } catch (error) {
    next(error);
  }
};

exports.getMyProperties = async (req, res, next) => {
  try {
    const properties = await Property.findBySeller(req.user.user_id);
    res.status(200).json({ success: true, data: properties });
  } catch (error) {
    next(error);
  }
};
