import { Router } from 'express';
import { queryAll, queryOne, run, getNextSequence } from '../db.js';
import { PRICES, getPickupFee } from '../config/prices.js';

const router = Router();

router.get('/prices', async (req, res) => {
  try {
    const { lat, lng } = req.query;
    const fee = lat && lng ? getPickupFee(parseFloat(lat), parseFloat(lng)) : 5000;
    res.json({ prices: PRICES, pickupFee: fee });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/kurirs/list', async (req, res) => {
  try {
    const kurirs = await queryAll("SELECT id, name, phone FROM users WHERE role = 'kurir'");
    res.json(kurirs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const { status, date, id_kurir_jemput, id_kurir_antar } = req.query;
    let sql = `
      SELECT orders.*, 
             kj.name as kurir_jemput_name, 
             ka.name as kurir_antar_name 
      FROM orders
      LEFT JOIN users kj ON orders.id_kurir_jemput = kj.id
      LEFT JOIN users ka ON orders.id_kurir_antar = ka.id
    `;
    const params = [];
    const conditions = [];

    if (status) {
      conditions.push(`orders.status = $${params.length + 1}`);
      params.push(status);
    }
    if (date) {
      conditions.push(`orders.created_at::date = $${params.length + 1}`);
      params.push(date);
    }
    if (id_kurir_jemput) {
      conditions.push(`orders.id_kurir_jemput = $${params.length + 1}`);
      params.push(id_kurir_jemput);
    }
    if (id_kurir_antar) {
      conditions.push(`orders.id_kurir_antar = $${params.length + 1}`);
      params.push(id_kurir_antar);
    }

    if (conditions.length) {
      sql += ' WHERE ' + conditions.join(' AND ');
    }

    sql += ' ORDER BY orders.created_at DESC';
    const orders = await queryAll(sql, params);
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/track', async (req, res) => {
  try {
    const { no } = req.query;
    if (!no) return res.status(400).json({ error: 'Nomor order diperlukan' });

    const order = await queryOne(`
      SELECT orders.*, 
             kj.name as kurir_jemput_name, 
             ka.name as kurir_antar_name 
      FROM orders
      LEFT JOIN users kj ON orders.id_kurir_jemput = kj.id
      LEFT JOIN users ka ON orders.id_kurir_antar = ka.id
      WHERE orders.order_no = $1
    `, [no]);
    
    if (!order) return res.status(404).json({ error: 'Order tidak ditemukan' });

    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const order = await queryOne(`
      SELECT orders.*, 
             kj.name as kurir_jemput_name, 
             ka.name as kurir_antar_name 
      FROM orders
      LEFT JOIN users kj ON orders.id_kurir_jemput = kj.id
      LEFT JOIN users ka ON orders.id_kurir_antar = ka.id
      WHERE orders.id = $1
    `, [req.params.id]);
    
    if (!order) return res.status(404).json({ error: 'Order tidak ditemukan' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { customer_name, phone, address, service_type, weight, pickup, notes, pickup_date, pickup_time, latitude, longitude, payment_method } = req.body;

    if (!customer_name || !phone || !service_type) {
      return res.status(400).json({ error: 'Nama, no HP, dan jenis layanan wajib diisi' });
    }

    const pricePerUnit = (PRICES[service_type] || {}).price || 0;
    const unit = (PRICES[service_type] || {}).unit;
    const qty = unit === 'kg' ? (parseFloat(weight) || 0) : 1;
    const total_price = qty * pricePerUnit + (pickup ? getPickupFee(latitude, longitude) : 0);

    const counter = await getNextSequence();
    const d = new Date();
    const y = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const orderNo = `LND${y}${mm}${dd}${String(counter).padStart(4, '0')}`;

    await run(
      `INSERT INTO orders (order_no, customer_name, phone, address, service_type, weight, pickup, notes, total_price, pickup_date, pickup_time, latitude, longitude, payment_method)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)`,
      [orderNo, customer_name, phone, address || '', service_type, weight || 0, pickup ? 1 : 0, notes || '', total_price, pickup_date || '', pickup_time || '', latitude ?? null, longitude ?? null, payment_method || 'cod']
    );

    const order = await queryOne('SELECT * FROM orders WHERE order_no = $1', [orderNo]);
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'diambil', 'dicuci', 'disetrika', 'selesai', 'diantar'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Status tidak valid' });
    }

    await run(
      "UPDATE orders SET status = $1, updated_at = NOW() WHERE id = $2",
      [status, req.params.id]
    );

    const order = await queryOne('SELECT * FROM orders WHERE id = $1', [req.params.id]);
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch('/:id/assign-kurir', async (req, res) => {
  try {
    const { id_kurir_jemput, id_kurir_antar } = req.body;

    let sql = 'UPDATE orders SET ';
    const params = [];
    const sets = [];

    if (id_kurir_jemput !== undefined) {
      sets.push(`id_kurir_jemput = $${params.length + 1}`);
      params.push(id_kurir_jemput);
    }
    if (id_kurir_antar !== undefined) {
      sets.push(`id_kurir_antar = $${params.length + 1}`);
      params.push(id_kurir_antar);
    }

    if (sets.length === 0) {
      return res.status(400).json({ error: 'Tidak ada data kurir yang diupdate' });
    }

    sql += sets.join(', ') + `, updated_at = NOW() WHERE id = $${params.length + 1}`;
    params.push(req.params.id);

    await run(sql, params);
    const order = await queryOne('SELECT * FROM orders WHERE id = $1', [req.params.id]);
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const order = await queryOne('SELECT * FROM orders WHERE id = $1', [req.params.id]);
    if (!order) return res.status(404).json({ error: 'Order tidak ditemukan' });

    const { customer_name, phone, address, service_type, weight, pickup, notes, pickup_date, pickup_time, latitude, longitude, payment_method } = req.body;
    if (!customer_name || !phone || !service_type) {
      return res.status(400).json({ error: 'Nama, no HP, dan jenis layanan wajib diisi' });
    }

    const pricePerUnit = (PRICES[service_type] || {}).price || 0;
    const unit = (PRICES[service_type] || {}).unit;
    const qty = unit === 'kg' ? (parseFloat(weight) || 0) : 1;
    const total_price = qty * pricePerUnit + (pickup ? getPickupFee(latitude, longitude) : 0);

    await run(
      `UPDATE orders SET customer_name = $1, phone = $2, address = $3, service_type = $4, weight = $5, pickup = $6, notes = $7, total_price = $8, pickup_date = $9, pickup_time = $10, latitude = $11, longitude = $12, payment_method = $13, updated_at = NOW() WHERE id = $14`,
      [customer_name, phone, address || '', service_type, weight || 0, pickup ? 1 : 0, notes || '', total_price, pickup_date || '', pickup_time || '', latitude ?? null, longitude ?? null, payment_method || 'cod', req.params.id]
    );

    const updated = await queryOne('SELECT * FROM orders WHERE id = $1', [req.params.id]);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
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

router.post('/:id/send-wa', async (req, res) => {
  try {
    const order = await queryOne('SELECT * FROM orders WHERE id = $1', [req.params.id]);
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
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const order = await queryOne('SELECT * FROM orders WHERE id = $1', [req.params.id]);
    if (!order) return res.status(404).json({ error: 'Order tidak ditemukan' });

    await run('DELETE FROM orders WHERE id = $1', [req.params.id]);
    res.json({ message: 'Order berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/report/summary', async (req, res) => {
  try {
    const today = await queryOne(`
      SELECT COUNT(*) as total_orders, COALESCE(SUM(total_price), 0) as total_revenue
      FROM orders WHERE created_at::date = NOW()::date
    `);

    const byStatus = await queryAll('SELECT status, COUNT(*) as count FROM orders GROUP BY status');

    res.json({ today, byStatus });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
