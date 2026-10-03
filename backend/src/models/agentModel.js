const db = require('../config/db');

class Agent {
  static async findAll() {
    const [rows] = await db.execute(`
      SELECT a.*, u.name, u.email, u.phone, u.profile_image 
      FROM agents a 
      JOIN users u ON a.user_id = u.user_id
      ORDER BY a.avg_rating DESC
    `);
    return rows;
  }

  static async findById(id) {
    const [rows] = await db.execute(`
      SELECT a.*, u.name, u.email, u.phone, u.profile_image 
      FROM agents a 
      JOIN users u ON a.user_id = u.user_id 
      WHERE a.agent_id = ?
    `, [id]);
    const agent = rows[0];
    if (agent) {
      const [reviews] = await db.execute(`
        SELECT r.*, u.name as reviewer_name 
        FROM reviews r 
        JOIN users u ON r.reviewer_id = u.user_id 
        WHERE r.agent_id = ? 
        ORDER BY r.created_at DESC
      `, [id]);
      agent.reviews = reviews;

      const [properties] = await db.execute(`
        SELECT p.*,
               (SELECT m.url FROM media m WHERE m.property_id = p.property_id AND m.is_primary = 1 LIMIT 1) AS primary_image
        FROM properties p
        WHERE p.agent_id = ? AND p.status = 'available'
      `, [id]);
      agent.properties = properties;
    }
    return agent;
  }

  static async findByUserId(user_id) {
    const [rows] = await db.execute('SELECT * FROM agents WHERE user_id = ?', [user_id]);
    return rows[0];
  }

  static async create(user_id, data = {}) {
    const { agency_name, license_number, bio } = data;
    const [result] = await db.execute(
      'INSERT INTO agents (user_id, agency_name, license_number, bio) VALUES (?, ?, ?, ?)',
      [user_id, agency_name || null, license_number || null, bio || null]
    );
    return result.insertId;
  }

  static async updateRating(agent_id) {
    const [result] = await db.execute('SELECT AVG(rating) as avg_rating, COUNT(*) as total_reviews FROM reviews WHERE agent_id = ?', [agent_id]);
    const avg = parseFloat(result[0].avg_rating) || 0;
    const total = result[0].total_reviews || 0;
    await db.execute('UPDATE agents SET avg_rating = ?, total_reviews = ? WHERE agent_id = ?', [avg, total, agent_id]);
    return { avg, total };
  }
}

module.exports = Agent;
