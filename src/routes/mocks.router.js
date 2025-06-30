import { Router } from 'express';
import generateMockUsers from '../utils/mockingUsers.js';
import UserModel from '../dao/models/User.js';
import PetModel from '../dao/models/Pet.js';

const router = Router();

// GET /api/mocks/mockingusers → Genera 50 usuarios de prueba
router.get('/mockingusers', (req, res) => {
  const users = generateMockUsers(50);
  res.json(users);
});

// GET /api/mocks/mockingpets → Genera 100 mascotas de prueba
router.get('/mockingpets', (req, res) => {
  const pets = [];
  for (let i = 0; i < 100; i++) {
    pets.push({
      name: `Pet${i}`,
      specie: 'dog',
      adopted: false,
      owner: null
    });
  }
  res.json(pets);
});

// POST /api/mocks/generateData → Genera usuarios y mascotas en la base de datos
router.post('/generateData', async (req, res) => {
  const { users: numUsers, pets: numPets } = req.body;

  try {
    // Generar usuarios
    const users = generateMockUsers(numUsers || 0);
    const insertedUsers = await UserModel.insertMany(users, { ordered: false });

    // Generar mascotas
    const pets = [];
    for (let i = 0; i < (numPets || 0); i++) {
      pets.push({
        name: `Pet${i}`,
        specie: 'dog',
        adopted: false,
        owner: null
      });
    }
    const insertedPets = await PetModel.insertMany(pets);

    res.json({
      message: 'Datos generados correctamente',
      usersInserted: insertedUsers.length,
      petsInserted: insertedPets.length
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error generando datos' });
  }
});

export default router;
