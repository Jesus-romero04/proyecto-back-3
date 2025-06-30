import express from 'express';
import PetModel from '../dao/models/Pet.js'; // ajusta si tu modelo está en otro lugar
import { generateMockPets } from '../mocks/mockPets.js';

const router = express.Router();

router.get('/mockingpets', async (req, res) => {
  try {
    const fakePets = generateMockPets(100);
    await PetModel.insertMany(fakePets);
    res.status(200).json({ message: '✅ Se insertaron 100 mascotas correctamente' });
  } catch (error) {
    console.error('❌ Error al insertar mascotas:', error);
    res.status(500).json({ message: 'Error al generar mascotas' });
  }
});

export default router;
