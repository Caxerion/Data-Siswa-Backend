const isEmpty = (value) => value === undefined || value === null || String(value).trim() === "";

const validateCreateJurusan = (req, res, next) => {
  const { nama_jurusan } = req.body;

  if (isEmpty(nama_jurusan)) {
    return res.status(400).json({
      success: false,
      message: "nama_jurusan wajib diisi",
    });
  }

  if (String(nama_jurusan).trim().length < 2) {
    return res.status(400).json({
      success: false,
      message: "nama_jurusan minimal 2 karakter",
    });
  }

  next();
};

const validateUpdateJurusan = (req, res, next) => {
  const { nama_jurusan } = req.body;

  if (nama_jurusan === undefined) {
    return res.status(400).json({
      success: false,
      message: "Tidak ada field yang dikirim untuk diupdate",
    });
  }

  if (isEmpty(nama_jurusan)) {
    return res.status(400).json({
      success: false,
      message: "nama_jurusan tidak boleh kosong",
    });
  }

  if (String(nama_jurusan).trim().length < 2) {
    return res.status(400).json({
      success: false,
      message: "nama_jurusan minimal 2 karakter",
    });
  }

  next();
};

const validateJurusanIdParam = (req, res, next) => {
  const { id } = req.params;
  if (!id || isNaN(Number(id))) {
    return res.status(400).json({
      success: false,
      message: "id jurusan tidak valid",
    });
  }
  next();
};

module.exports = {
  validateCreateJurusan,
  validateUpdateJurusan,
  validateJurusanIdParam,
};
