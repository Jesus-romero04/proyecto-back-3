import {fakerES_MX as fa} from "@faker-js/faker"

export const generatePet = () => {
    let name = fa.person.firstName();
    let specie = fa.animal.dog();
    let birthDate = fa.date.birthdate();

    return {
        name,
        specie,
        birthDate,
        mock: true
    }
};