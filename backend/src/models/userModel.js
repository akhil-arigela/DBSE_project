const db = require('../config/db');

class User {
  static async findByEmail(email) {
    const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0];
  }

  static async findById(id) {
    const [rows] = await db.execute('SELECT * FROM users WHERE user_id = ?', [id]);
    return rows[0];
  }

  static async create(data) {
    const { name, email, password_hash, role, phone } = data;
    const [result] = await db.execute(
      'INSERT INTO users (name, email, password_hash, role, phone) VALUES (?, ?, ?, ?, ?)',
      [name, email, password_hash, role || 'buyer', phone || null]
    );
    return result.insertId;
  }

  static async updateProfile(id, fields) {
    const keys = Object.keys(fields);
    if (keys.length === 0) return false;
    
    const setClause = keys.map(key => `${key} = ?`).join(', ');
    const values = Object.values(fields);
    values.push(id);

    const [result] = await db.execute(
      `UPDATE users SET ${setClause} WHERE user_id = ?`,
      values
    );
    return result.affectedRows > 0;
  }
}

module.exports = User;
