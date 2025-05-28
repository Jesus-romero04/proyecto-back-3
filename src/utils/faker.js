import { fakerDE } from "@faker-js/faker";
import { createHash } from "./index.js";

export const generateUser = async (usersNumber) => {
  try {
    const users = [];
    for (let i = 0; i < usersNumber; i++) {
      const randomPercentage = Math.random();
      const role = randomPercentage < 0.25 ? "admin" : "user";

      const password = await createHash("coder123");

      users.push({
        _id: fakerDE.database.mongodbObjectId(),
        first_name: fakerDE.person.firstName(),
        last_name: fakerDE.person.lastName(),
        email: fakerDE.internet.email(),
        password,
        role,
        pets: [],
      });
    }
    return users;
  } catch (error) {
    console.log("No se pudo generar el/los usuario(s)", error);
    throw error;
  }
};

export const generatePet = async (petsNumber) => {
  try {
    const pets = [];
    for (let i = 0; i < petsNumber; i++) {
      pets.push({
        _id: fakerDE.database.mongodbObjectId(),
        name: fakerDE.person.firstName(),
        specie: fakerDE.animal.dog(),
        birthDate: fakerDE.date.past(),
        adopted: false,
        owner: null,
        image: fakerDE.image.avatar(),
      });
    }
    return pets;
  } catch (error) {
    console.log("No se pudo generar la(s) mascota(s)", error);
    throw error;
  }
};
