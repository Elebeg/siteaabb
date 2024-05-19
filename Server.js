const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const db = new sqlite3.Database(':memory:');

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../public')));

// Rota para servir a página inicial
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Rota para servir a página de reservas
app.get('/reservas', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/reservas.html'));
});

// Rota para obter todas as reservas
app.get('/api/reservas', (req, res) => {
    const query = `SELECT * FROM reservas`;
    db.all(query, [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ reservas: rows });
    });
});

db.serialize(() => {
    db.run(`CREATE TABLE reservas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT,
        instalacao TEXT,
        data TEXT,
        hora TEXT
    )`);
});

app.post('/reservar', (req, res) => {
    const { nome, instalacao, data, hora } = req.body;

    const query = `SELECT COUNT(*) AS count FROM reservas WHERE instalacao = ? AND data = ? AND hora = ?`;
    db.get(query, [instalacao, data, hora], (err, row) => {
        if (err) {
            return res.json({ success: false, message: 'Erro ao acessar o banco de dados' });
        }
        if (row.count > 0) {
            return res.json({ success: false, message: 'Horário já reservado' });
        } else {
            const insert = `INSERT INTO reservas (nome, instalacao, data, hora) VALUES (?, ?, ?, ?)`;
            db.run(insert, [nome, instalacao, data, hora], function (err) {
                if (err) {
                    return res.json({ success: false, message: 'Erro ao inserir reserva' });
                }
                res.json({ success: true });
            });
        }
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
