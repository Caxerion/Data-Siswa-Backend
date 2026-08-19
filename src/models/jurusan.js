const { pool } = require("../config/db");

class Jurusan {
  constructor({ id, nama_jurusan, created_at, updated_at }) {
    this.id = id;
    this.nama_jurusan = nama_jurusan;
    this.created_at = created_at;
    this.updated_at = updated_at;
  }

  static async findAll() {
    const [rows] = await pool.query("SELECT * FROM jurusan ORDER BY nama_jurusan ASC");
    return rows.map((row) => new Jurusan(row));
  }

  static async findById(id) {
    const [rows] = await pool.query("SELECT * FROM jurusan WHERE id = ?", [id]);
    if (rows.length === 0) return null;
    return new Jurusan(rows[0]);
  }

  static async existsByName(nama_jurusan, excludeId = null) {
    let query = "SELECT id FROM jurusan WHERE nama_jurusan = ?";
    const params = [nama_jurusan];
    if (excludeId) {
      query += " AND id <> ?";
      params.push(excludeId);
    }
    const [rows] = await pool.query(query, params);
    return rows.length > 0;
  }

  async save() {
    const [result] = await pool.query(
      "INSERT INTO jurusan (nama_jurusan) VALUES (?)",
      [this.nama_jurusan]
    );
    this.id = result.insertId;
    return this;
  }

  async update(fieldsToUpdate) {
    const columns = [];
    const values = [];

    for (const [key, value] of Object.entries(fieldsToUpdate)) {
      if (value !== undefined && key !== "id") {
        columns.push(`${key} = ?`);
        values.push(value);
        this[key] = value;
      }
    }

    if (columns.length === 0) return this;

    values.push(this.id);
    await pool.query(`UPDATE jurusan SET ${columns.join(", ")} WHERE id = ?`, values);
    return Jurusan.findById(this.id);
  }

  async delete() {
    await pool.query("DELETE FROM jurusan WHERE id = ?", [this.id]);
    return true;
  }

  toJSON() {
    return {
      id: this.id,
      nama_jurusan: this.nama_jurusan,
      created_at: this.created_at,
      updated_at: this.updated_at,
    };
  }
}

module.exports = Jurusan;
