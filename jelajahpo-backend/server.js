const express = require('express');
const cors = require('cors');
const app = express();
const mysql = require('mysql2');
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'jelajahpo_db'
});
db.connect(err => {
    if (err) {
        console.log('Gagal konek database:', err);
    } else {
        console.log('Berhasil konek ke database JelajahPo');
    }
});
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Selamat Datang di JelajahPo API');
});

app.get('/wisata', (req, res) => {
    const sql = 'SELECT * FROM wisata';
    db.query(sql, (err, result) => {
        if (err) return res.status(500).json({ error: err });
        res.json(result);
    });
});

app.get('/kategori', (req, res) => {
    const sql = 'SELECT * FROM kategori';
    db.query(sql, (err, result) => {
        if (err) {
            return res.status(500).json({ error: err });
        }
        res.json(result);
    });
});

app.post('/wisata', (req, res) => {
    const { nama_wisata, deskripsi, harga_tiket, id_kategori } = req.body;

    if (!nama_wisata || !harga_tiket) {
        return res.status(400).json({ message: 'Nama Wisata dan Harga Tiket wajib diisi' });
    }
    if (!deskripsi || deskripsi.trim() === '') {
        return res.status(400).json({ message: 'Deskripsi wajib diisi' });
    }
    const sql = 'INSERT INTO wisata (nama_wisata, deskripsi, harga_tiket, id_kategori, tgl_input) VALUES (?, ?, ?, ?, NOW())';
    db.query(sql, [nama_wisata, deskripsi, harga_tiket, id_kategori], (err, result) => {
        if (err) return res.status(500).json({ error: err.sqlMessage });
        res.json({ message: 'Wisata berhasil ditambahkan', id_kategori: result.insertId });
    });
});

app.get('/kategori', (req, res) => {
    const sql = "SELECT * FROM kategori";
    db.query(sql, (err, result) => {
        if (err) {
            return res.status(500).json({ message: "Gagal mengambil data kategori" });
        }
        res.json(result);
    });
});

app.put('/wisata/:id_wisata', (req, res) => {
    const { id_wisata } = req.params;
    const { nama_wisata, deskripsi, harga_tiket, id_kategori } = req.body;

    if (!nama_wisata || !harga_tiket) {
        return res.status(400).json({ message: ' Nama Wisata dan harga_tiket wajib diisi' });
    }

    const sql = 'UPDATE wisata SET nama_wisata=?, deskripsi=?, harga_tiket=?, id_kategori=? WHERE id_wisata=?';
    db.query(sql, [nama_wisata, deskripsi, harga_tiket, id_kategori, id_wisata], (err, result) => {
        if (err) return res.status(500).json({ error: err.sqlMessage });
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Wisata tidak ditemukan' });
        }
        res.json({ message: 'Wisata berhasil diupdate!' });
    });
});

app.delete('/wisata/:id_wisata', (req, res) => {
    const { id_wisata } = req.params;
    const sql = 'DELETE FROM wisata WHERE id_wisata =?';
    db.query(sql, [id_wisata], (err, result) => {
        if (err) return res.status(500).json({ message: err.sqlMessage });
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Wisata tidak ditemukan' });
        }
        res.json({ message: 'Wisata berhasil dihapus!' });
    });
});
app.listen(PORT, () => {
    console.log(`Server JelajahPo jalan di http://localhost:${PORT}`);
})