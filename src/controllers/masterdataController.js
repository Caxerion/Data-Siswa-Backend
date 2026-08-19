const Jurusan = require("../models/jurusan");

class MasterdataController {
  async getAllJurusan(req, res) {
    try {
      const daftarJurusan = await Jurusan.findAll();
      res.status(200).json({
        success: true,
        total: daftarJurusan.length,
        data: daftarJurusan.map((j) => j.toJSON()),
      });
    } catch (error) {
      console.error("Error getAllJurusan:", error.message);
      res.status(500).json({ success: false, message: "Gagal mengambil data jurusan" });
    }
  }

  async getJurusanById(req, res) {
    try {
      const { id } = req.params;
      const jurusan = await Jurusan.findById(id);

      if (!jurusan) {
        return res.status(404).json({
          success: false,
          message: `Jurusan dengan id ${id} tidak ditemukan`,
        });
      }

      res.status(200).json({ success: true, data: jurusan.toJSON() });
    } catch (error) {
      console.error("Error getJurusanById:", error.message);
      res.status(500).json({ success: false, message: "Gagal mengambil data jurusan" });
    }
  }

  async createJurusan(req, res) {
    try {
      const { nama_jurusan } = req.body;

      if (!nama_jurusan || String(nama_jurusan).trim() === "") {
        return res.status(400).json({
          success: false,
          message: "nama_jurusan wajib diisi",
        });
      }

      const sudahAda = await Jurusan.existsByName(nama_jurusan);
      if (sudahAda) {
        return res.status(409).json({
          success: false,
          message: `Jurusan "${nama_jurusan}" sudah ada`,
        });
      }

      const jurusanBaru = new Jurusan({ nama_jurusan: String(nama_jurusan).trim() });
      const saved = await jurusanBaru.save();

      res.status(201).json({
        success: true,
        message: "Data jurusan berhasil ditambahkan",
        data: saved.toJSON(),
      });
    } catch (error) {
      console.error("Error createJurusan:", error.message);
      res.status(500).json({ success: false, message: "Gagal menambahkan data jurusan" });
    }
  }

  async updateJurusan(req, res) {
    try {
      const { id } = req.params;
      const { nama_jurusan } = req.body;

      const jurusan = await Jurusan.findById(id);
      if (!jurusan) {
        return res.status(404).json({
          success: false,
          message: `Jurusan dengan id ${id} tidak ditemukan`,
        });
      }

      if (nama_jurusan === undefined || String(nama_jurusan).trim() === "") {
        return res.status(400).json({
          success: false,
          message: "nama_jurusan tidak boleh kosong",
        });
      }

      const sudahAda = await Jurusan.existsByName(nama_jurusan, id);
      if (sudahAda) {
        return res.status(409).json({
          success: false,
          message: `Jurusan "${nama_jurusan}" sudah digunakan`,
        });
      }

      const updated = await jurusan.update({ nama_jurusan: String(nama_jurusan).trim() });

      res.status(200).json({
        success: true,
        message: "Data jurusan berhasil diupdate",
        data: updated.toJSON(),
      });
    } catch (error) {
      console.error("Error updateJurusan:", error.message);
      res.status(500).json({ success: false, message: "Gagal mengupdate data jurusan" });
    }
  }

  async deleteJurusan(req, res) {
    try {
      const { id } = req.params;
      const jurusan = await Jurusan.findById(id);

      if (!jurusan) {
        return res.status(404).json({
          success: false,
          message: `Jurusan dengan id ${id} tidak ditemukan`,
        });
      }

      await jurusan.delete();

      res.status(200).json({
        success: true,
        message: `Data jurusan "${jurusan.nama_jurusan}" berhasil dihapus`,
      });
    } catch (error) {
      console.error("Error deleteJurusan:", error.message);
      res.status(500).json({ success: false, message: "Gagal menghapus data jurusan" });
    }
  }
}

module.exports = new MasterdataController();
