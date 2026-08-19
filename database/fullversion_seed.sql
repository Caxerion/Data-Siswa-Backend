-- ==========================================================
-- Seed data siswa (dijalankan SETELAH init.sql)
-- Menggunakan TRANSACTION agar aman:
-- kalau ada error, data bisa di-ROLLBACK
-- ==========================================================

START TRANSACTION;

INSERT INTO siswa (kode_siswa, nama_siswa, alamat_siswa, tgl_siswa, jurusan_siswa) VALUES
('SIS001', 'Ahmad Fauzi', 'Jl. Merdeka No. 10, Tangerang', '2008-03-14', 'Rekayasa Perangkat Lunak'),
('SIS002', 'Siti Nurhaliza', 'Jl. Kebon Jeruk No. 5, Jakarta', '2007-11-02', 'Teknik Komputer Jaringan'),
('SIS003', 'Budi Santoso', 'Jl. Cendrawasih No. 22, Tangerang Selatan', '2008-07-25', 'Multimedia');

INSERT INTO jurusan (nama_jurusan) VALUES
('Rekayasa Perangkat Lunak'),
('Teknik Komputer Jaringan'),
('Multimedia');

COMMIT;
