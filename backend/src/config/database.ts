
import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

export default pool;

// Test de connexion
pool.on('connect', () => {
  console.log('✅ Connexion à la base de données établie');
});

pool.on('error', (err) => {
  console.error('❌ Erreur de connexion à la base de données:', err);
});
