import { faker } from '@faker-js/faker';

export function generateMockPets(count = 100) {
  const pets = [];

  for (let i = 0; i < count; i++) {
    pets.push({
      name: faker.animal.dog(),
      specie: 'dog',
      breed: faker.animal.dog(),
      adopted: false // sin owner
    });
  }

  return pets;
}
