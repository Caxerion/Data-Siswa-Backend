-- ==========================================================
-- Setup Database & Tabel Data Siswa
-- ==========================================================

CREATE DATABASE IF NOT EXISTS db_data_siswa;
USE db_data_siswa;

DROP TABLE IF EXISTS siswa;

CREATE TABLE siswa (
  kode_siswa     VARCHAR(20) PRIMARY KEY,
  nama_siswa     VARCHAR(100) NOT NULL,
  alamat_siswa   TEXT NOT NULL,
  tgl_siswa      DATE NOT NULL,
  jurusan_siswa  VARCHAR(100) NOT NULL,
  no_telp        VARCHAR(20) NOT NULL,
  created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================================
-- Trigger: otomatis update kolom updated_at setiap ada perubahan
-- (Langkah Kerja 9g - Membuat trigger)
-- ==========================================================

DELIMITER //
CREATE TRIGGER trg_siswa_before_update
BEFORE UPDATE ON siswa
FOR EACH ROW
BEGIN
  SET NEW.updated_at = CURRENT_TIMESTAMP;
END//
DELIMITER ;

-- ==========================================================
-- Stored Procedure: mengambil semua data siswa
-- (Langkah Kerja 9e - Membuat store procedure)
-- ==========================================================

DELIMITER //
CREATE PROCEDURE sp_get_all_siswa()
BEGIN
  SELECT * FROM siswa ORDER BY created_at DESC;
END//
DELIMITER ;

-- ==========================================================
-- Function: menghitung total data siswa
-- (Langkah Kerja 9f - Membuat function)
-- ==========================================================

DELIMITER //
CREATE FUNCTION fn_total_siswa() RETURNS INT
DETERMINISTIC
BEGIN
  DECLARE total INT;
  SELECT COUNT(*) INTO total FROM siswa;
  RETURN total;
END//
DELIMITER ;

-- ==========================================================
-- Contoh data awal (opsional, untuk testing)
-- Jalankan seed.sql setelah init.sql selesai
-- ==========================================================

CREATE TABLE IF NOT EXISTS jurusan (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  nama_jurusan VARCHAR(100) NOT NULL UNIQUE,
  created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Trigger update timestamp untuk tabel jurusan
DELIMITER //
CREATE TRIGGER trg_jurusan_before_update
BEFORE UPDATE ON jurusan
FOR EACH ROW
BEGIN
  SET NEW.updated_at = CURRENT_TIMESTAMP;
END//
DELIMITER ;

-- Cara pakai stored procedure & function (contoh, bukan wajib dijalankan):
-- CALL sp_get_all_siswa();
-- SELECT fn_total_siswa();