const Siswa = require("../models/Siswa");

/**
 * Class SiswaController
 * Menangani request/response HTTP untuk resource "Data Siswa".
 * Validasi input sudah ditangani middleware (lihat middlewares/validateSiswa.js),
 * jadi controller fokus ke business logic saja.
 */
class SiswaController {
  // ================== READ (Get All) ==================
  // GET /api/siswa
  async getAllSiswa(req, res) {
    try {
      const daftarSiswa = await Siswa.findAll();
      res.status(200).json({
        success: true,
        total: daftarSiswa.length,
        data: daftarSiswa.map((s) => s.toJSON()),
      });
    } catch (error) {
      console.error("Error getAllSiswa:", error.message);
      res.status(500).json({ success: false, message: "Gagal mengambil data siswa" });
    }
  }

  // ================== READ (Get One) ==================
  // GET /api/siswa/:kode_siswa
  async getSiswaByKode(req, res) {
    try {
      const { kode_siswa } = req.params;
      const siswa = await Siswa.findByKode(kode_siswa);

      if (!siswa) {
        return res.status(404).json({
          success: false,
          message: `Siswa dengan kode ${kode_siswa} tidak ditemukan`,
        });
      }

      res.status(200).json({ success: true, data: siswa.toJSON() });
    } catch (error) {
      console.error("Error getSiswaByKode:", error.message);
      res.status(500).json({ success: false, message: "Gagal mengambil data siswa" });
    }
  }

  // ================== CREATE ==================
  // POST /api/siswa
  // Body sudah lolos validasi dari middleware validateCreateSiswa
  async createSiswa(req, res) {
    try {
      let { kode_siswa, nama_siswa, alamat_siswa, tgl_siswa, jurusan_siswa } = req.body;

      if (!kode_siswa) {
        kode_siswa = await Siswa.getNextKode();
      }

      const sudahAda = await Siswa.exists(kode_siswa);
      if (sudahAda) {
        return res.status(409).json({
          success: false,
          message: `Kode siswa ${kode_siswa} sudah digunakan`,
        });
      }

      const siswaBaru = new Siswa({ kode_siswa, nama_siswa, alamat_siswa, tgl_siswa, jurusan_siswa });
      const saved = await siswaBaru.save();

      res.status(201).json({
        success: true,
        message: "Data siswa berhasil ditambahkan",
        data: saved.toJSON(),
      });
    } catch (error) {
      console.error("Error createSiswa:", error.message);
      res.status(500).json({ success: false, message: "Gagal menambahkan data siswa" });
    }
  }

  // ================== UPDATE ==================
  // PUT /api/siswa/:kode_siswa
  // Body sudah lolos validasi dari middleware validateUpdateSiswa
  async updateSiswa(req, res) {
    try {
      const { kode_siswa } = req.params;
      const { nama_siswa, alamat_siswa, tgl_siswa, jurusan_siswa } = req.body;

      const siswa = await Siswa.findByKode(kode_siswa);
      if (!siswa) {
        return res.status(404).json({
          success: false,
          message: `Siswa dengan kode ${kode_siswa} tidak ditemukan`,
        });
      }

      const updated = await siswa.update({ nama_siswa, alamat_siswa, tgl_siswa, jurusan_siswa });

      res.status(200).json({
        success: true,
        message: "Data siswa berhasil diupdate",
        data: updated.toJSON(),
      });
    } catch (error) {
      console.error("Error updateSiswa:", error.message);
      res.status(500).json({ success: false, message: "Gagal mengupdate data siswa" });
    }
  }

  // ================== DELETE ==================
  // DELETE /api/siswa/:kode_siswa
  async deleteSiswa(req, res) {
    try {
      const { kode_siswa } = req.params;

      const siswa = await Siswa.findByKode(kode_siswa);
      if (!siswa) {
        return res.status(404).json({
          success: false,
          message: `Siswa dengan kode ${kode_siswa} tidak ditemukan`,
        });
      }

      await siswa.delete();

      res.status(200).json({
        success: true,
        message: `Data siswa dengan kode ${kode_siswa} berhasil dihapus`,
      });
    } catch (error) {
      console.error("Error deleteSiswa:", error.message);
      res.status(500).json({ success: false, message: "Gagal menghapus data siswa" });
    }
  }

  // ================== EXTRA: total siswa (pakai SQL function) ==================
  // GET /api/siswa/stats/total
  async getTotalSiswa(req, res) {
    try {
      const total = await Siswa.count();
      res.status(200).json({ success: true, total });
    } catch (error) {
      console.error("Error getTotalSiswa:", error.message);
      res.status(500).json({ success: false, message: "Gagal menghitung total siswa" });
    }
  }
}

// Export satu instance -> method-nya langsung dipakai sebagai handler route
module.exports = new SiswaController();