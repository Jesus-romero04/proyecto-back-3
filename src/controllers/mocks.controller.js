import { generatePet } from "../mocks/petMocks.js";
import { generateUser } from "../mocks/userMocks.js";
import PetDTO from "../dto/Pet.dto.js";
import { logger } from "../utils/logger.js";
import { errorTypes } from "../middlewares/errorHandler.js";

import { usersService, petsService } from "../services/index.js";


const createMockingPet = async (req, res) => {
    try {
        let pets = [];
        for (let i = 0; i < 100; i++) {
            let { name, specie, birthDate } = generatePet();

            logger.debug("Info de generatePet: ", { name, specie, birthDate });

            if (!name || !specie || !birthDate) {
                logger.warn(errorTypes._ID_VALIDATE)
                return res.status(400).send({ status: "error", error: errorTypes._ID_VALIDATE })
            };
            const pet = PetDTO.getPetInputFrom({ name, specie, birthDate });
            pets.push(pet)
        };
        logger.debug("Pets generados: ", pets)
        res.send({ status: "success", payload: pets })
    } catch (error) {
        logger.warn("Tenemos un error: ", error)
        res.status(500).send(error)
    };
}

const createMockingUser = async (req, res, next) => {
    try {
        const { quantity } = req.query;

        const qty = Number(quantity);
        if(qty === 0){
            throw new Error("Error forzado, qty = 0")
        };

        logger.debug("Cantidad del req.query: ", { quantity })
        let users = [];
        for (let i = 0; i < quantity; i++) {
            const { first_name, last_name, email, password, role } = await generateUser();
            if (!first_name || !last_name || !email || !password || !role) return res.status(400).send({ status: "error", error: errorTypes._ID_VALIDATE });
            const user = {
                first_name: first_name,
                last_name: last_name,
                email: email,
                password: password,
                role: role,
                pets: []
            };
            users.push(user);
        }
        logger.info("Users creados: ", { users })
        res.status(200).send({ status: "success", payload: users })
    } catch (error) {
        // logger.error("Hubo un error 500: ", { error })
        // res.status(500).send(error)
        logger.error("Error generado en createMockingUser")
        next(error)
    };
}

const generateData = async (req, res, next) => {
    try {
        const { users, pets } = req.query;
        if (!users || !pets) return res.status(400).send({ status: "error", error: errorTypes._QUANTITY_DATA });

        logger.debug(`Cantidad de users ${users}`);
        logger.debug(`Cantidad de pets ${pets}`);


        //Insercion en base de datos de users creados
        for (let i = 0; i < users; i++) {
            const { first_name, last_name, email, password, role } = await generateUser();
            if (!first_name || !last_name || !email || !password || !role) {
                logger.warn(errorTypes._ID_VALIDATE)
                return res.status(400).send({ status: "error", error: errorTypes._ID_VALIDATE });
            };
            const user = {
                first_name: first_name,
                last_name: last_name,
                email: email,
                password: password,
                role: role,
                pets: []
            };
            await usersService.create(user);
        };
        for (let i = 0; i < pets; i++) {
            let { name, specie, birthDate } = generatePet();
            if (!name || !specie || !birthDate) {
                logger.warn(errorTypes._ID_VALIDATE)
                return res.status(400).send({ status: "error", error: errorTypes._ID_VALIDATE })
            };

            const pet = PetDTO.getPetInputFrom({ name, specie, birthDate });
            await petsService.create(pet);
        };

        logger.info(`${users} usuarios y ${pets} mascotas creados`)


        res.status(200).send({ status: "success", message: `${users} usuarios y ${pets} mascotas creados e insertados en base de datos` })

        // ¿DEBO DESARROLLAR CONTROLADORES?
    } catch (error) {
        logger.error(`Error en generateData: ${error}`)
        res.send(error)
    }
}

export default { createMockingPet, createMockingUser, generateData };