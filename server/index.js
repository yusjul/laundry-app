import express from 'express';
import cors from 'cors';
import { initDB } from './db.js';
import ordersRouter from './routes/orders.js';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());
app.use('/api/orders', ordersRouter);

initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});
