/**
 * Middleware validasi untuk resource "Data Siswa".
 * Dipisah dari controller supaya logic validasi bisa dipakai ulang
 * dan controller fokus ke business logic saja.
 */

const KODE_SISWA_REGEX = /^[A-Za-z0-9-]{3,20}$/; // contoh: SIS001
const TGL_SISWA_REGEX = /^\d{4}-\d{2}-\d{2}$/; // format YYYY-MM-DD

// Helper: cek string kosong / cuma spasi
const isEmpty = (value) => value === undefined || value === null || String(value).trim() === "";

// Helper: cek tanggal valid secara kalender (bukan cuma format)
const isValidDate = (value) => {
  if (!TGL_SISWA_REGEX.test(value)) return false;
  const date = new Date(value);
  return !isNaN(date.getTime());
};

/**
 * Validasi untuk CREATE (POST /api/siswa)
 * Semua field wajib diisi dan formatnya harus benar.
 */
const validateCreateSiswa = (req, res, next) => {
  const { kode_siswa, nama_siswa, alamat_siswa, tgl_siswa, jurusan_siswa, no_telp } = req.body;
  const errors = [];

  if (kode_siswa !== undefined && kode_siswa !== null && String(kode_siswa).trim() !== "") {
    if (!KODE_SISWA_REGEX.test(String(kode_siswa))) {
      errors.push("kode_siswa hanya boleh huruf, angka, dan tanda '-' (3-20 karakter)");
    }
  }

  if (isEmpty(nama_siswa)) {
    errors.push("nama_siswa wajib diisi");
  } else if (nama_siswa.trim().length < 3) {
    errors.push("nama_siswa minimal 3 karakter");
  }

  if (isEmpty(alamat_siswa)) {
    errors.push("alamat_siswa wajib diisi");
  }

  if (isEmpty(tgl_siswa)) {
    errors.push("tgl_siswa wajib diisi");
  } else if (!isValidDate(tgl_siswa)) {
    errors.push("tgl_siswa harus format YYYY-MM-DD dan tanggal valid");
  }

  if (isEmpty(jurusan_siswa)) {
    errors.push("jurusan_siswa wajib diisi");
  }

  if (isEmpty(no_telp)) {
    errors.push("no_telp wajib diisi");
  }

  if (errors.length > 0) {
    return res.status(400).json({ success: false, message: "Validasi gagal", errors });
  }

  next();
};

/**
 * Validasi untuk UPDATE (PUT /api/siswa/:kode_siswa)
 * Field bersifat opsional (partial update), tapi kalau dikirim
 * formatnya tetap harus benar. Minimal satu field harus dikirim.
 */
const validateUpdateSiswa = (req, res, next) => {
  const { nama_siswa, alamat_siswa, tgl_siswa, jurusan_siswa, no_telp } = req.body;
  const errors = [];

  const adaField = [nama_siswa, alamat_siswa, tgl_siswa, jurusan_siswa, no_telp].some(
    (v) => v !== undefined
  );
  if (!adaField) {
    return res.status(400).json({
      success: false,
      message: "Tidak ada field yang dikirim untuk diupdate",
    });
  }

  if (nama_siswa !== undefined) {
    if (isEmpty(nama_siswa)) errors.push("nama_siswa tidak boleh kosong");
    else if (nama_siswa.trim().length < 3) errors.push("nama_siswa minimal 3 karakter");
  }

  if (alamat_siswa !== undefined && isEmpty(alamat_siswa)) {
    errors.push("alamat_siswa tidak boleh kosong");
  }

  if (tgl_siswa !== undefined) {
    if (isEmpty(tgl_siswa)) errors.push("tgl_siswa tidak boleh kosong");
    else if (!isValidDate(tgl_siswa)) errors.push("tgl_siswa harus format YYYY-MM-DD dan tanggal valid");
  }

  if (jurusan_siswa !== undefined && isEmpty(jurusan_siswa)) {
    errors.push("jurusan_siswa tidak boleh kosong");
  }

  if (no_telp !== undefined && isEmpty(no_telp)) {
    errors.push("no_telp tidak boleh kosong");
  }

  if (errors.length > 0) {
    return res.status(400).json({ success: false, message: "Validasi gagal", errors });
  }

  next();
};

/**
 * Validasi param kode_siswa di URL (dipakai di GET one, PUT, DELETE)
 */
const validateKodeSiswaParam = (req, res, next) => {
  const { kode_siswa } = req.params;
  if (isEmpty(kode_siswa) || !KODE_SISWA_REGEX.test(kode_siswa)) {
    return res.status(400).json({
      success: false,
      message: "kode_siswa pada URL tidak valid",
    });
  }
  next();
};

module.exports = {
  validateCreateSiswa,
  validateUpdateSiswa,
  validateKodeSiswaParam,
};