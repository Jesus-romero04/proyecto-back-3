// src/server.js
import app from './app.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 8080;
const MONGO_URL = process.env.MONGO_URL;

if (!MONGO_URL) {
  throw new Error("Falta la variable MONGO_URL en .env");
}

mongoose.connect(MONGO_URL)
  .then(() => {
    console.log('✅ Conectado a MongoDB');
    app.listen(PORT, () => {
      console.log(`🚀 Servidor escuchando en puerto ${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ Error al conectar a MongoDB', err);
  });
