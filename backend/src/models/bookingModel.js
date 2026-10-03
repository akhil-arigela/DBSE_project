const db = require('../config/db');

class Booking {
  static async create(data) {
    const { property_id, buyer_id, agent_id, visit_date, visit_time, notes } = data;
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      // Check for slot conflict (unique constraint on property_id + visit_date + visit_time)
      const [conflicts] = await connection.execute(
        `SELECT booking_id FROM bookings
         WHERE property_id = ? AND visit_date = ? AND visit_time = ?
           AND status IN ('pending', 'confirmed')`,
        [property_id, visit_date, visit_time]
      );

      if (conflicts.length > 0) {
        throw new Error('Slot not available');
      }

      const [result] = await connection.execute(
        `INSERT INTO bookings (property_id, buyer_id, agent_id, visit_date, visit_time, notes, status)
         VALUES (?, ?, ?, ?, ?, ?, 'pending')`,
        [property_id, buyer_id, agent_id || null, visit_date, visit_time, notes || null]
      );

      await connection.commit();
      return result.insertId;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  static async findByBuyer(buyer_id) {
    const [rows] = await db.execute(
      `SELECT b.*, p.title as property_title, p.address, p.city, p.price, p.property_type,
              u.name as buyer_name
       FROM bookings b
       JOIN properties p ON b.property_id = p.property_id
       JOIN users u ON b.buyer_id = u.user_id
       WHERE b.buyer_id = ?
       ORDER BY b.visit_date DESC, b.visit_time DESC`,
      [buyer_id]
    );
    return rows;
  }

  static async findBySeller(seller_id) {
    const [rows] = await db.execute(
      `SELECT b.*, p.title as property_title, p.address, p.city, p.price, p.property_type,
              u.name as buyer_name, u.email as buyer_email, u.phone as buyer_phone
       FROM bookings b
       JOIN properties p ON b.property_id = p.property_id
       JOIN users u ON b.buyer_id = u.user_id
       WHERE p.seller_id = ?
       ORDER BY b.visit_date DESC, b.visit_time DESC`,
      [seller_id]
    );
    return rows;
  }

  static async findByProperty(property_id) {
    const [rows] = await db.execute(
      `SELECT b.*, u.name as buyer_name, u.email as buyer_email, u.phone as buyer_phone
       FROM bookings b
       JOIN users u ON b.buyer_id = u.user_id
       WHERE b.property_id = ?
       ORDER BY b.visit_date DESC, b.visit_time DESC`,
      [property_id]
    );
    return rows;
  }

  static async findByAgent(agent_id) {
    const [rows] = await db.execute(
      `SELECT b.*, p.title as property_title, p.address, p.city,
              u.name as buyer_name, u.email as buyer_email, u.phone as buyer_phone
       FROM bookings b
       JOIN properties p ON b.property_id = p.property_id
       JOIN users u ON b.buyer_id = u.user_id
       WHERE b.agent_id = ?
       ORDER BY b.visit_date DESC, b.visit_time DESC`,
      [agent_id]
    );
    return rows;
  }

  static async updateStatus(booking_id, status) {
    const [result] = await db.execute(
      'UPDATE bookings SET status = ? WHERE booking_id = ?',
      [status, booking_id]
    );
    return result.affectedRows > 0;
  }

  static async findById(id) {
    const [rows] = await db.execute(
      `SELECT b.*, p.title as property_title, p.seller_id,
              u.name as buyer_name
       FROM bookings b
       JOIN properties p ON b.property_id = p.property_id
       JOIN users u ON b.buyer_id = u.user_id
       WHERE b.booking_id = ?`,
      [id]
    );
    return rows[0];
  }
}

module.exports = Booking;
