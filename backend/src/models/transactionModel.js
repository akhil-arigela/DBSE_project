const db = require('../config/db');

class Transaction {
  static async create(data) {
    const { property_id, buyer_id, seller_id, agent_id, transaction_type, amount, status } = data;
    const [result] = await db.execute(
      'INSERT INTO transactions (property_id, buyer_id, seller_id, agent_id, transaction_type, amount, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [property_id, buyer_id, seller_id, agent_id || null, transaction_type, amount, status || 'pending']
    );
    return result.insertId;
  }

  static async findByBuyer(buyer_id) {
    const [rows] = await db.execute('SELECT t.*, p.title as property_title FROM transactions t JOIN properties p ON t.property_id = p.property_id WHERE t.buyer_id = ? ORDER BY t.created_at DESC', [buyer_id]);
    return rows;
  }

  static async findByProperty(property_id) {
    const [rows] = await db.execute('SELECT * FROM transactions WHERE property_id = ? ORDER BY created_at DESC', [property_id]);
    return rows;
  }

  static async findAll() {
    const [rows] = await db.execute('SELECT * FROM transactions ORDER BY created_at DESC');
    return rows;
  }
}

module.exports = Transaction;
