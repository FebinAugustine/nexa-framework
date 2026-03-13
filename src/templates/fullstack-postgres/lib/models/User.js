import { pool } from '../../config/db.js';

export class User {
  static async findOne(query) {
    const { email } = query;
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0] || null;
  }

  static async findById(id) {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    return result.rows[0] || null;
  }

  static async find({}, projection) {
    const fields = projection === '-password' ? 'id, email, name, role, created_at, updated_at' : '*';
    const result = await pool.query(`SELECT ${fields} FROM users`);
    return result.rows;
  }

  static async create(userData) {
    const { email, password, name, role = 'user' } = userData;
    const result = await pool.query(
      'INSERT INTO users (email, password, name, role, created_at, updated_at) VALUES ($1, $2, $3, $4, NOW(), NOW()) RETURNING *',
      [email, password, name, role]
    );
    return result.rows[0];
  }

  static async findByIdAndUpdate(id, updates) {
    const { role } = updates;
    const result = await pool.query(
      'UPDATE users SET role = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
      [role, id]
    );
    return result.rows[0];
  }

  static async findByIdAndDelete(id) {
    const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
  }
}
