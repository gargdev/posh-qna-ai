import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './routes/index';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use('/api', routes); // <--- use API routes

app.get('/api/health', (_req, res) => {
  res.json({ status: 'OK' });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
