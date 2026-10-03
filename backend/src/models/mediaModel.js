const db = require('../config/db');

class Media {
  static async findByProperty(property_id) {
    const [rows] = await db.execute(
      'SELECT * FROM media WHERE property_id = ? ORDER BY is_primary DESC, display_order ASC',
      [property_id]
    );
    return rows;
  }

  static async create(data) {
    const { property_id, url, filename, media_type, is_primary } = data;
    const [result] = await db.execute(
      'INSERT INTO media (property_id, url, filename, media_type, is_primary) VALUES (?, ?, ?, ?, ?)',
      [property_id, url, filename || null, media_type || 'photo', is_primary ? 1 : 0]
    );
    return result.insertId;
  }

  static async deleteById(id) {
    const [result] = await db.execute('DELETE FROM media WHERE media_id = ?', [id]);
    return result.affectedRows > 0;
  }

  static async setPrimary(media_id, property_id) {
    await db.execute('UPDATE media SET is_primary = FALSE WHERE property_id = ?', [property_id]);
    const [result] = await db.execute(
      'UPDATE media SET is_primary = TRUE WHERE media_id = ? AND property_id = ?',
      [media_id, property_id]
    );
    return result.affectedRows > 0;
  }
}

module.exports = Media;
