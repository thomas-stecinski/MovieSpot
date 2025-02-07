const { Client } = require('pg');

const client = new Client({
  host: '127.0.0.1', // ⚠️ PAS 'localhost'
  port: 5432,
  user: 'admin',
  password: 'admin',
  database: 'exomoviedb',
  ssl: false // 🔥 Désactive SSL pour voir si ça cause un problème
});

client.connect()
  .then(() => {
    console.log("✅ Connexion réussie !");
    return client.end();
  })
  .catch(err => {
    console.error("❌ Erreur de connexion", err);
  });
