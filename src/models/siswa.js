const { pool } = require("../config/db");

/**
 * Class Siswa
 * Merepresentasikan entitas "Data Siswa" sekaligus menangani
 * akses data (query) ke database -> pemrograman berorientasi objek
 * (Langkah Kerja 7a, 7b, 7c: membuat class, method/operasi kelas,
 * konsep berbasis objek)
 */
class Siswa {
  constructor({ kode_siswa, nama_siswa, alamat_siswa, tgl_siswa, jurusan_siswa, no_telp, created_at, updated_at }) {
    this.kode_siswa = kode_siswa;
    this.nama_siswa = nama_siswa;
    this.alamat_siswa = alamat_siswa;
    this.tgl_siswa = tgl_siswa;
    this.jurusan_siswa = jurusan_siswa;
    this.no_telp = no_telp;
    this.created_at = created_at;
    this.updated_at = updated_at;
  }

  // ===== Static method: ambil semua data (jadi list of Siswa) =====
  static async findAll() {
    const [rows] = await pool.query("SELECT * FROM siswa ORDER BY created_at DESC");
    return rows.map((row) => new Siswa(row));
  }

  // ===== Static method: cari satu data berdasarkan kode =====
  static async findByKode(kode_siswa) {
    const [rows] = await pool.query("SELECT * FROM siswa WHERE kode_siswa = ?", [kode_siswa]);
    if (rows.length === 0) return null;
    return new Siswa(rows[0]);
  }

  // ===== Static method: cek apakah kode sudah dipakai =====
  static async exists(kode_siswa) {
    const [rows] = await pool.query("SELECT kode_siswa FROM siswa WHERE kode_siswa = ?", [kode_siswa]);
    return rows.length > 0;
  }

  // ===== Static method: hitung total siswa (pakai function SQL fn_total_siswa) =====
  static async count() {
    const [rows] = await pool.query("SELECT fn_total_siswa() AS total");
    return rows[0].total;
  }

  // ===== Static method: generate kode_siswa otomatis =====
  static async getNextKode() {
    const [rows] = await pool.query("SELECT kode_siswa FROM siswa ORDER BY kode_siswa DESC LIMIT 1");
    if (rows.length === 0) return "SIS001";

    const lastKode = rows[0].kode_siswa;
    const match = lastKode.match(/^([A-Za-z]+)(\d+)$/);
    if (!match) return "SIS001";

    const prefix = match[1];
    const num = parseInt(match[2], 10) + 1;
    return `${prefix}${String(num).padStart(match[2].length, "0")}`;
  }

  // ===== Instance method: simpan objek Siswa ini sebagai row baru (Create) =====
  async save() {
    await pool.query(
      "INSERT INTO siswa (kode_siswa, nama_siswa, alamat_siswa, tgl_siswa, jurusan_siswa, no_telp) VALUES (?, ?, ?, ?, ?, ?)",
      [this.kode_siswa, this.nama_siswa, this.alamat_siswa, this.tgl_siswa, this.jurusan_siswa, this.no_telp]
    );
    return Siswa.findByKode(this.kode_siswa);
  }

  // ===== Instance method: update field pada objek ini (partial update) =====
  async update(fieldsToUpdate) {
    const columns = [];
    const values = [];

    for (const [key, value] of Object.entries(fieldsToUpdate)) {
      if (value !== undefined && key !== "kode_siswa") {
        columns.push(`${key} = ?`);
        values.push(value);
        this[key] = value; // sinkronkan state objek
      }
    }

    if (columns.length === 0) return this;

    values.push(this.kode_siswa);
    await pool.query(`UPDATE siswa SET ${columns.join(", ")} WHERE kode_siswa = ?`, values);
    return Siswa.findByKode(this.kode_siswa);
  }

  // ===== Instance method: hapus data ini dari database =====
  async delete() {
    await pool.query("DELETE FROM siswa WHERE kode_siswa = ?", [this.kode_siswa]);
    return true;
  }

  // ===== Instance method: representasi objek dalam bentuk JSON rapi =====
  toJSON() {
    return {
      kode_siswa: this.kode_siswa,
      nama_siswa: this.nama_siswa,
      alamat_siswa: this.alamat_siswa,
      tgl_siswa: this.tgl_siswa,
      jurusan_siswa: this.jurusan_siswa,
      no_telp: this.no_telp,
      created_at: this.created_at,
      updated_at: this.updated_at,
    };
  }
}

module.exports = Siswa;