import { petsService, usersService } from "../services/index.js";
import { generatePet, generateUser } from "../utils/faker.js";

export const createMockingUsers = async (req, res) => {
  const { users = 50 } = req.query;
  const usersPayload = await generateUser(Number(users));
  res.send({ status: "success", usersPayload });
};

export const createMockingPets = async (req, res) => {
  const { pets = 50 } = req.query;
  const petsPayload = await generatePet(Number(pets));
  res.send({ status: "success", petsPayload });
};

export const createDataOnDatabase = async (req, res) => {
  const { users, pets } = req.query;

  if (!users || !pets) {
    return res.status(400).send({
      status: "error",
      error: "Debe especificar la cantidad de usuarios (users) y mascotas (pets) a generar",
    });
  }

  const usersPayload = await generateUser(Number(users));
  const petsPayload = await generatePet(Number(pets));

  usersService.create(usersPayload);
  petsService.create(petsPayload);

  res.send({
    status: "success",
    msg: "Usuarios y mascotas cargados correctamente en la base de datos",
  });
};
