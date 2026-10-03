const db = require('../config/db');

class Property {
  static async findAll(filters = {}) {
    let query = `
      SELECT p.*,
             u.name AS seller_name,
             ag.agent_id AS assigned_agent_id,
             au.name AS agent_name,
             ag.agency_name,
             (SELECT m.url FROM media m WHERE m.property_id = p.property_id AND m.is_primary = 1 LIMIT 1) AS primary_image
      FROM properties p
      LEFT JOIN users u ON p.seller_id = u.user_id
      LEFT JOIN agents ag ON p.agent_id = ag.agent_id
      LEFT JOIN users au ON ag.user_id = au.user_id
      WHERE p.status = 'available'
    `;
    const params = [];

    if (filters.city)          { query += ' AND p.city = ?';            params.push(filters.city); }
    if (filters.property_type) { query += ' AND p.property_type = ?';   params.push(filters.property_type); }
    if (filters.listing_type)  { query += ' AND p.listing_type = ?';    params.push(filters.listing_type); }
    if (filters.min_price)     { query += ' AND p.price >= ?';          params.push(Number(filters.min_price)); }
    if (filters.max_price)     { query += ' AND p.price <= ?';          params.push(Number(filters.max_price)); }
    if (filters.search) {
      query += ' AND (p.title LIKE ? OR p.description LIKE ? OR p.city LIKE ?)';
      params.push(`%${filters.search}%`, `%${filters.search}%`, `%${filters.search}%`);
    }

    const limit  = Math.min(parseInt(filters.limit)  || 12, 50);
    const page   = Math.max(parseInt(filters.page)   || 1, 1);
    const offset = (page - 1) * limit;

    query += ' ORDER BY p.created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const [rows] = await db.query(query, params);
    return rows;
  }

  static async countAll(filters = {}) {
    let query = `SELECT COUNT(*) AS total FROM properties p WHERE p.status = 'available'`;
    const params = [];

    if (filters.city)          { query += ' AND p.city = ?';            params.push(filters.city); }
    if (filters.property_type) { query += ' AND p.property_type = ?';   params.push(filters.property_type); }
    if (filters.listing_type)  { query += ' AND p.listing_type = ?';    params.push(filters.listing_type); }
    if (filters.min_price)     { query += ' AND p.price >= ?';          params.push(Number(filters.min_price)); }
    if (filters.max_price)     { query += ' AND p.price <= ?';          params.push(Number(filters.max_price)); }
    if (filters.search) {
      query += ' AND (p.title LIKE ? OR p.description LIKE ? OR p.city LIKE ?)';
      params.push(`%${filters.search}%`, `%${filters.search}%`, `%${filters.search}%`);
    }

    const [rows] = await db.query(query, params);
    return rows[0].total;
  }

  static async findById(id) {
    const [rows] = await db.execute(`
      SELECT p.*,
             u.name AS seller_name, u.email AS seller_email, u.phone AS seller_phone,
             ag.agent_id AS agent_profile_id, ag.agency_name, ag.bio AS agent_bio,
             ag.experience_years, ag.avg_rating AS agent_rating,
             au.name AS agent_name, au.phone AS agent_phone, au.email AS agent_email
      FROM properties p
      LEFT JOIN users u   ON p.seller_id = u.user_id
      LEFT JOIN agents ag ON p.agent_id  = ag.agent_id
      LEFT JOIN users au  ON ag.user_id  = au.user_id
      WHERE p.property_id = ?
    `, [id]);

    const property = rows[0];
    if (!property) return null;

    // Attach media
    const [media] = await db.execute(
      'SELECT * FROM media WHERE property_id = ? ORDER BY is_primary DESC, display_order ASC',
      [id]
    );
    property.media = media;

    // Attach amenities (return objects with name)
    const [amenities] = await db.execute(
      `SELECT a.amenity_id, a.name
       FROM amenities a
       JOIN property_amenities pa ON a.amenity_id = pa.amenity_id
       WHERE pa.property_id = ?`,
      [id]
    );
    property.amenities = amenities;

    // Attach avg rating
    const [ratingRows] = await db.execute(
      'SELECT AVG(rating) AS avg_rating, COUNT(*) AS total_reviews FROM reviews WHERE property_id = ?',
      [id]
    );
    property.avg_rating    = parseFloat(ratingRows[0].avg_rating) || 0;
    property.total_reviews = ratingRows[0].total_reviews || 0;

    return property;
  }

  static async create(data) {
    const allowed = [
      'seller_id','agent_id','title','description','property_type','listing_type',
      'price','address','city','state','country','pincode','latitude','longitude',
      'bedrooms','bathrooms','area_sqft','has_virtual_tour','status'
    ];
    const filtered = Object.fromEntries(Object.entries(data).filter(([k]) => allowed.includes(k)));
    const keys   = Object.keys(filtered);
    const values = Object.values(filtered);
    const [result] = await db.execute(
      `INSERT INTO properties (${keys.join(', ')}) VALUES (${keys.map(() => '?').join(', ')})`,
      values
    );
    return result.insertId;
  }

  static async update(id, data) {
    const allowed = [
      'agent_id','title','description','property_type','listing_type','price',
      'address','city','state','country','pincode','bedrooms','bathrooms',
      'area_sqft','has_virtual_tour','status'
    ];
    const filtered = Object.fromEntries(Object.entries(data).filter(([k]) => allowed.includes(k)));
    const keys = Object.keys(filtered);
    if (keys.length === 0) return false;
    const setClause = keys.map(k => `${k} = ?`).join(', ');
    const values = [...Object.values(filtered), id];
    const [result] = await db.execute(`UPDATE properties SET ${setClause} WHERE property_id = ?`, values);
    return result.affectedRows > 0;
  }

  static async softDelete(id) {
    const [result] = await db.execute(
      "UPDATE properties SET status = 'inactive' WHERE property_id = ?", [id]
    );
    return result.affectedRows > 0;
  }

  static async findBySeller(seller_id) {
    const [rows] = await db.execute(
      `SELECT p.*,
              (SELECT m.url FROM media m WHERE m.property_id = p.property_id AND m.is_primary = 1 LIMIT 1) AS primary_image
       FROM properties p
       WHERE p.seller_id = ?
       ORDER BY p.created_at DESC`,
      [seller_id]
    );
    return rows;
  }
}

module.exports = Property;
