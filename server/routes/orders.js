import { Router } from 'express';
import { queryAll, queryOne, run, getNextSequence } from '../db.js';
import { PRICES, PICKUP_FEE } from '../config/prices.js';

const router = Router();

router.get('/prices', (req, res) => {
  res.json({ prices: PRICES, pickupFee: PICKUP_FEE });
});

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
  const { customer_name, phone, address, service_type, weight, pickup, notes, pickup_date, pickup_time, latitude, longitude, payment_method } = req.body;

  if (!customer_name || !phone || !service_type) {
    return res.status(400).json({ error: 'Nama, no HP, dan jenis layanan wajib diisi' });
  }

  const pricePerUnit = (PRICES[service_type] || {}).price || 0;
  const unit = (PRICES[service_type] || {}).unit;
  const qty = unit === 'kg' ? (parseFloat(weight) || 0) : 1;
  const total_price = qty * pricePerUnit + (pickup ? PICKUP_FEE : 0);

  const counter = getNextSequence();
  const d = new Date();
  const y = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  const orderNo = `LND${y}${mm}${dd}${String(counter).padStart(4, '0')}`;

  run(
    `INSERT INTO orders (order_no, customer_name, phone, address, service_type, weight, pickup, notes, total_price, pickup_date, pickup_time, latitude, longitude, payment_method)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [orderNo, customer_name, phone, address || '', service_type, weight || 0, pickup ? 1 : 0, notes || '', total_price, pickup_date || '', pickup_time || '', latitude ?? null, longitude ?? null, payment_method || 'cod']
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

  const { customer_name, phone, address, service_type, weight, pickup, notes, pickup_date, pickup_time, latitude, longitude, payment_method } = req.body;
  if (!customer_name || !phone || !service_type) {
    return res.status(400).json({ error: 'Nama, no HP, dan jenis layanan wajib diisi' });
  }

  const pricePerUnit = (PRICES[service_type] || {}).price || 0;
  const unit = (PRICES[service_type] || {}).unit;
  const qty = unit === 'kg' ? (parseFloat(weight) || 0) : 1;
  const total_price = qty * pricePerUnit + (pickup ? PICKUP_FEE : 0);

  run(
    `UPDATE orders SET customer_name = ?, phone = ?, address = ?, service_type = ?, weight = ?, pickup = ?, notes = ?, total_price = ?, pickup_date = ?, pickup_time = ?, latitude = ?, longitude = ?, payment_method = ?, updated_at = datetime('now', 'localtime') WHERE id = ?`,
    [customer_name, phone, address || '', service_type, weight || 0, pickup ? 1 : 0, notes || '', total_price, pickup_date || '', pickup_time || '', latitude ?? null, longitude ?? null, payment_method || 'cod', req.params.id]
  );

  const updated = queryOne('SELECT * FROM orders WHERE id = ?', [req.params.id]);
  res.json(updated);
});

const statusLabels = {
  pending: 'Menunggu', diambil: 'Diambil', dicuci: 'Dicuci',
  disetrika: 'Disetrika', selesai: 'Selesai', diantar: 'Diantar',
};

const waTemplates = {
  pending: 'sedang MENUNGGU untuk diproses.',
  diambil: 'sudah DIAMBIL oleh kurir kami.',
  dicuci: 'sedang dalam proses PENCUCIAN.',
  disetrika: 'sedang dalam proses SETRIKA.',
  selesai: 'sudah SELESAI diproses dan siap diantar/diambil.',
  diantar: 'sedang DIANTAR ke alamat Anda.',
};

router.post('/:id/send-wa', (req, res) => {
  const order = queryOne('SELECT * FROM orders WHERE id = ?', [req.params.id]);
  if (!order) return res.status(404).json({ error: 'Order tidak ditemukan' });

  const statusLabel = statusLabels[order.status] || order.status;
  const template = waTemplates[order.status] || 'sedang diproses.';

  const message =
    `Halo ${order.customer_name},\n\n` +
    `Laundry Anda dengan nomor order *${order.order_no}* ${template}\n\n` +
    `Detail Pesanan:\n` +
    `• Layanan: ${order.service_type}\n` +
    `${order.weight > 0 ? `• Berat: ${order.weight} kg\n` : ''}` +
    `• Total: Rp ${order.total_price.toLocaleString()}\n` +
    `• Status: ${statusLabel}\n\n` +
    `Terima kasih telah menggunakan LaundryKu!`;

  const waUrl = `https://wa.me/${order.phone.replace(/^0/, '62').replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;

  console.log('[WA Notification]', { to: order.phone, order_no: order.order_no, status: order.status, message });

  res.json({ success: true, waUrl, message });
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
