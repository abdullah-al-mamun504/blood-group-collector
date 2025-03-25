const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT,
});

app.use(cors());
app.use(express.json());

// API Routes
app.post('/submit', async (req, res) => {
    const { name, bloodGroup } = req.body;
    try {
        await pool.query('INSERT INTO blood_data (name, blood_group) VALUES ($1, $2)', [name, bloodGroup]);
        res.status(201).json({ message: 'Data saved successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error saving data' });
    }
});

app.get('/data', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM blood_data');
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching data' });
    }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

