import { Router } from 'express';
import { queryAll, queryOne, run } from '../db.js';

const router = Router();

function generateOrderNo() {
  const date = new Date();
  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const yy = String(date.getFullYear()).slice(-2);
  const rand = String(Math.floor(Math.random() * 1000)).padStart(3, '0');
  return `LND${dd}${mm}${yy}${rand}`;
}

router.get('/', (req, res) => {
  const { status, date } = req.query;
  let sql = 'SELECT * FROM orders';
  const params = [];
  const conditions = [];

  if (status) {
    conditions.push('status = ?');
    params.push(status);
  }
  if (date) {
    conditions.push("date(created_at) = ?");
    params.push(date);
  }

  if (conditions.length) {
    sql += ' WHERE ' + conditions.join(' AND ');
  }

  sql += ' ORDER BY created_at DESC';
  const orders = queryAll(sql, params);
  res.json(orders);
});

router.get('/track', (req, res) => {
  const { no } = req.query;
  if (!no) return res.status(400).json({ error: 'Nomor order diperlukan' });

  const order = queryOne('SELECT * FROM orders WHERE order_no = ?', [no]);
  if (!order) return res.status(404).json({ error: 'Order tidak ditemukan' });

  res.json(order);
});

router.get('/:id', (req, res) => {
  const order = queryOne('SELECT * FROM orders WHERE id = ?', [req.params.id]);
  if (!order) return res.status(404).json({ error: 'Order tidak ditemukan' });
  res.json(order);
});

router.post('/', (req, res) => {
  const { customer_name, phone, address, service_type, weight, pickup, notes } = req.body;

  if (!customer_name || !phone || !service_type) {
    return res.status(400).json({ error: 'Nama, no HP, dan jenis layanan wajib diisi' });
  }

  const prices = {
    'Cuci Kering': 7000,
    'Cuci Setrika': 10000,
    'Dry Clean': 15000,
    'Bed Cover': 25000,
  };

  const pricePerUnit = prices[service_type] || 0;
  const qty = service_type === 'Cuci Kering' || service_type === 'Cuci Setrika' ? (weight || 1) : 1;
  const total_price = qty * pricePerUnit + (pickup ? 5000 : 0);

  const orderNo = generateOrderNo();

  run(
    `INSERT INTO orders (order_no, customer_name, phone, address, service_type, weight, pickup, notes, total_price)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [orderNo, customer_name, phone, address || '', service_type, weight || 0, pickup ? 1 : 0, notes || '', total_price]
  );

  const order = queryOne('SELECT * FROM orders WHERE order_no = ?', [orderNo]);
  res.status(201).json(order);
});

router.patch('/:id/status', (req, res) => {
  const { status } = req.body;
  const validStatuses = ['pending', 'diambil', 'dicuci', 'disetrika', 'selesai', 'diantar'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Status tidak valid' });
  }

  run(
    "UPDATE orders SET status = ?, updated_at = datetime('now', 'localtime') WHERE id = ?",
    [status, req.params.id]
  );

  const order = queryOne('SELECT * FROM orders WHERE id = ?', [req.params.id]);
  res.json(order);
});

router.put('/:id', (req, res) => {
  const order = queryOne('SELECT * FROM orders WHERE id = ?', [req.params.id]);
  if (!order) return res.status(404).json({ error: 'Order tidak ditemukan' });

  const { customer_name, phone, address, service_type, weight, pickup, notes } = req.body;
  if (!customer_name || !phone || !service_type) {
    return res.status(400).json({ error: 'Nama, no HP, dan jenis layanan wajib diisi' });
  }

  const prices = { 'Cuci Kering': 7000, 'Cuci Setrika': 10000, 'Dry Clean': 15000, 'Bed Cover': 25000 };
  const pricePerUnit = prices[service_type] || 0;
  const qty = service_type === 'Cuci Kering' || service_type === 'Cuci Setrika' ? (weight || 1) : 1;
  const total_price = qty * pricePerUnit + (pickup ? 5000 : 0);

  run(
    `UPDATE orders SET customer_name = ?, phone = ?, address = ?, service_type = ?, weight = ?, pickup = ?, notes = ?, total_price = ?, updated_at = datetime('now', 'localtime') WHERE id = ?`,
    [customer_name, phone, address || '', service_type, weight || 0, pickup ? 1 : 0, notes || '', total_price, req.params.id]
  );

  const updated = queryOne('SELECT * FROM orders WHERE id = ?', [req.params.id]);
  res.json(updated);
});

router.delete('/:id', (req, res) => {
  const order = queryOne('SELECT * FROM orders WHERE id = ?', [req.params.id]);
  if (!order) return res.status(404).json({ error: 'Order tidak ditemukan' });

  run('DELETE FROM orders WHERE id = ?', [req.params.id]);
  res.json({ message: 'Order berhasil dihapus' });
});

router.get('/report/summary', (req, res) => {
  const today = queryOne(`
    SELECT COUNT(*) as total_orders, COALESCE(SUM(total_price), 0) as total_revenue
    FROM orders WHERE date(created_at) = date('now', 'localtime')
  `);

  const byStatus = queryAll('SELECT status, COUNT(*) as count FROM orders GROUP BY status');

  res.json({ today, byStatus });
});

export default router;
