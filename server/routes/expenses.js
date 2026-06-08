import { Router } from 'express';
import { queryAll, queryOne, run, getPool } from '../db.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const { start, end } = req.query;
    let sql = 'SELECT * FROM expenses';
    const params = [];

    if (start && end) {
      sql += ' WHERE date >= $1 AND date <= $2';
      params.push(start, end);
    } else if (start) {
      sql += ' WHERE date >= $1';
      params.push(start);
    } else if (end) {
      sql += ' WHERE date <= $1';
      params.push(end);
    }

    sql += ' ORDER BY date DESC, created_at DESC';
    res.json(await queryAll(sql, params));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { name, category, amount, date, notes } = req.body;
    if (!name || !amount || !date) {
      return res.status(400).json({ error: 'Nama, nominal, dan tanggal wajib diisi' });
    }

    const pool = getPool();
    const { rows } = await pool.query(
      `INSERT INTO expenses (name, category, amount, date, notes) VALUES ($1, $2, $3, $4, $5) RETURNING id`,
      [name, category || 'Lainnya', parseFloat(amount), date, notes || '']
    );

    const expense = await queryOne('SELECT * FROM expenses WHERE id = $1', [rows[0].id]);
    res.status(201).json(expense);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const expense = await queryOne('SELECT * FROM expenses WHERE id = $1', [req.params.id]);
    if (!expense) return res.status(404).json({ error: 'Pengeluaran tidak ditemukan' });

    const { name, category, amount, date, notes } = req.body;
    if (!name || !amount || !date) {
      return res.status(400).json({ error: 'Nama, nominal, dan tanggal wajib diisi' });
    }

    await run(
      `UPDATE expenses SET name = $1, category = $2, amount = $3, date = $4, notes = $5 WHERE id = $6`,
      [name, category || 'Lainnya', parseFloat(amount), date, notes || '', req.params.id]
    );

    const updated = await queryOne('SELECT * FROM expenses WHERE id = $1', [req.params.id]);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const expense = await queryOne('SELECT * FROM expenses WHERE id = $1', [req.params.id]);
    if (!expense) return res.status(404).json({ error: 'Pengeluaran tidak ditemukan' });

    await run('DELETE FROM expenses WHERE id = $1', [req.params.id]);
    res.json({ message: 'Pengeluaran berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
