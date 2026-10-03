const db = require('../config/db');

class Review {
  static async create(data) {
    const { property_id, agent_id, reviewer_id, rating, comment } = data;
    const [result] = await db.execute(
      'INSERT INTO reviews (property_id, agent_id, reviewer_id, rating, comment) VALUES (?, ?, ?, ?, ?)',
      [property_id || null, agent_id || null, reviewer_id, rating, comment]
    );
    return result.insertId;
  }

  static async findByProperty(property_id) {
    const [rows] = await db.execute('SELECT r.*, u.name as reviewer_name FROM reviews r JOIN users u ON r.reviewer_id = u.user_id WHERE r.property_id = ? ORDER BY r.created_at DESC', [property_id]);
    return rows;
  }

  static async findByAgent(agent_id) {
    const [rows] = await db.execute('SELECT r.*, u.name as reviewer_name FROM reviews r JOIN users u ON r.reviewer_id = u.user_id WHERE r.agent_id = ? ORDER BY r.created_at DESC', [agent_id]);
    return rows;
  }

  static async findByReviewer(reviewer_id) {
    const [rows] = await db.execute('SELECT * FROM reviews WHERE reviewer_id = ? ORDER BY created_at DESC', [reviewer_id]);
    return rows;
  }
}

module.exports = Review;
