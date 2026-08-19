const express = require("express");
const router = express.Router();
const siswaController = require("../controllers/siswaController");
const {
  validateCreateSiswa,
  validateUpdateSiswa,
  validateKodeSiswaParam,
} = require("../middleware/validateSiswa");

// Route spesifik ditaruh sebelum route dengan parameter dinamis
router.get("/stats/total", siswaController.getTotalSiswa); // GET    /api/siswa/stats/total

router.get("/", siswaController.getAllSiswa);                                        // GET    /api/siswa
router.get("/:kode_siswa", validateKodeSiswaParam, siswaController.getSiswaByKode);   // GET    /api/siswa/:kode_siswa
router.post("/", validateCreateSiswa, siswaController.createSiswa);                  // POST   /api/siswa
router.put("/:kode_siswa", validateKodeSiswaParam, validateUpdateSiswa, siswaController.updateSiswa); // PUT /api/siswa/:kode_siswa
router.delete("/:kode_siswa", validateKodeSiswaParam, siswaController.deleteSiswa);   // DELETE /api/siswa/:kode_siswa

module.exports = router;