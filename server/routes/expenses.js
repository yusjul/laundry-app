import { Router } from 'express';
import { queryAll, queryOne, run } from '../db.js';

const router = Router();

router.get('/', (req, res) => {
  const { start, end } = req.query;
  let sql = 'SELECT * FROM expenses';
  const params = [];

  if (start && end) {
    sql += ' WHERE date >= ? AND date <= ?';
    params.push(start, end);
  } else if (start) {
    sql += ' WHERE date >= ?';
    params.push(start);
  } else if (end) {
    sql += ' WHERE date <= ?';
    params.push(end);
  }

  sql += ' ORDER BY date DESC, created_at DESC';
  res.json(queryAll(sql, params));
});

router.post('/', (req, res) => {
  const { name, category, amount, date, notes } = req.body;
  if (!name || !amount || !date) {
    return res.status(400).json({ error: 'Nama, nominal, dan tanggal wajib diisi' });
  }

  run(
    `INSERT INTO expenses (name, category, amount, date, notes) VALUES (?, ?, ?, ?, ?)`,
    [name, category || 'Lainnya', parseFloat(amount), date, notes || '']
  );

  const expense = queryOne('SELECT * FROM expenses WHERE id = last_insert_rowid()');
  res.status(201).json(expense);
});

router.put('/:id', (req, res) => {
  const expense = queryOne('SELECT * FROM expenses WHERE id = ?', [req.params.id]);
  if (!expense) return res.status(404).json({ error: 'Pengeluaran tidak ditemukan' });

  const { name, category, amount, date, notes } = req.body;
  if (!name || !amount || !date) {
    return res.status(400).json({ error: 'Nama, nominal, dan tanggal wajib diisi' });
  }

  run(
    `UPDATE expenses SET name = ?, category = ?, amount = ?, date = ?, notes = ? WHERE id = ?`,
    [name, category || 'Lainnya', parseFloat(amount), date, notes || '', req.params.id]
  );

  const updated = queryOne('SELECT * FROM expenses WHERE id = ?', [req.params.id]);
  res.json(updated);
});

router.delete('/:id', (req, res) => {
  const expense = queryOne('SELECT * FROM expenses WHERE id = ?', [req.params.id]);
  if (!expense) return res.status(404).json({ error: 'Pengeluaran tidak ditemukan' });

  run('DELETE FROM expenses WHERE id = ?', [req.params.id]);
  res.json({ message: 'Pengeluaran berhasil dihapus' });
});

export default router;
