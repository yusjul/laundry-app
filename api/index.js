import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { initDB } from '../server/db.js';
import ordersRouter from '../server/routes/orders.js';
import expensesRouter from '../server/routes/expenses.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/orders', ordersRouter);
app.use('/api/expenses', expensesRouter);

const clientDist = path.join(__dirname, '..', 'client', 'dist');
app.use(express.static(clientDist));
app.get('*', (req, res) => {
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(clientDist, 'index.html'));
  }
});

let dbReady = null;

export default async function handler(req, res) {
  if (!dbReady) {
    dbReady = initDB().catch(err => {
      console.error('[DB Init Error]', err.message);
      dbReady = null;
      throw err;
    });
  }
  await dbReady;
  return app(req, res);
}
