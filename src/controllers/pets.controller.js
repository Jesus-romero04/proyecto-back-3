import PetDTO from "../dto/Pet.dto.js";
import { petsService } from "../services/index.js"
import __dirname from "../utils/index.js";

import { logger } from "../utils/logger.js";
import { errorTypes, errorTypesCodes } from "../middlewares/errorHandler.js";
import { CustomError } from "../utils/CustomError.js";
import mongoose from "mongoose";

const getAllPets = async (req, res, next) => {
    try {
        const pets = await petsService.getAll();
        if (!Array.isArray(pets) || pets.length === 0) {
            logger.debug(errorTypes.NOT_FOUND)
            CustomError.generateError(errorTypes.NOT_FOUND, "Error en la obtencion de documentos Pets", "No se obtuvieron los documentos Pets de la base de datos", errorTypesCodes.NOT_FOUND)
        }
        res.status(200).send({ status: "success", payload: pets })
    } catch (error) {
        logger.warn(error.message);
        next(error);
    };
};

const createPet = async (req, res, next) => {
    try {
        const { name, specie, birthDate } = req.body;
        const inputDate = new Date(birthDate);
        const todayDate = new Date();
        if (!name || !specie || !birthDate) {
            logger.debug(errorTypes.PARAMS);
            CustomError.generateError(errorTypes.PARAMS, "Debes pasar correctamente los datos para crear la mascota", "Los parametros recibidos en el req.body son invalidos o estan incompletos", errorTypesCodes.INVALID_DATA);
        } else if (typeof name !== "string" || typeof specie !== "string" || typeof birthDate !== "string") {
            logger.debug(errorTypes.TYPE_DATA);
            CustomError.generateError(errorTypes.TYPE_DATA, "El tipo de dato de los campos ingresados no es de tipo String como deberia ser", "Los datos ingresados no son String", errorTypesCodes.TYPE_DATA)
        } else if (inputDate > todayDate || isNaN(inputDate)) {
            logger.debug(errorTypes.TYPE_DATA);
            CustomError.generateError(errorTypes.TYPE_DATA, "La fecha ingresada en el campo birthDate es invalida", "Fecha invalida", errorTypesCodes.TYPE_DATA)
        }
        const pet = PetDTO.getPetInputFrom({ name, specie, birthDate });
        if (typeof pet.name !== "string" || typeof pet.specie !== "string" || typeof pet.birthDate !== "string" || typeof pet.adopted !== "boolean") {
            logger.debug(errorTypes.DTO);
            CustomError.generateError(errorTypes.DTO, "Error en la creacion del PetDTO", "Error con el DTO", errorTypesCodes.INTERNAL_SERVER_ERROR)
        }
        const result = await petsService.create(pet);
        if (!result) {
            logger.debug(errorTypes.CREATE);
            CustomError.generateError(errorTypes.CREATE, "Hubo un error en la creacion de la mascota", "Error en createPet", errorTypesCodes.createError)
        }
        res.status(201).send({ status: "success", payload: result })
    } catch (error) {
        logger.warn(error.message);
        next(error);
    };
};

const updatePet = async (req, res, next) => {
    try {
        const petUpdateBody = req.body;
        const petId = req.params.pid;
        const typePetId = mongoose.isValidObjectId(petId);

        if (!petUpdateBody.name || !petUpdateBody.specie || !petUpdateBody.birthDate || !petId) {
            logger.debug(errorTypes.PARAMS)
            CustomError.generateError(errorTypes.PARAMS, "Informacion para editar la mascota incompleta", "Faltan campos por completar", errorTypesCodes.ARGUMENTOS_INVALIDOS);
        };
        if (typeof petId !== "string" || typePetId === false) {
            logger.debug(errorTypes.TYPE_DATA);
            CustomError.generateError(errorTypes.TYPE_DATA, "El id ingresado es invalido", "No es del typeof object", errorTypesCodes.TIPO_DE_DATOS);
        }
        const result = await petsService.update(petId, petUpdateBody);
        res.status(200).send({ status: "success", message: "pet updated", payloadPet: result })
    } catch (error) {
        logger.warn(error.message);
        next(error);
    };
};

const deletePet = async (req, res, next) => {
    try {
        const petId = req.params.pid;
        if (!petId) {
            logger.debug(errorTypes.PARAMS);
            CustomError.generateError(errorTypes.PARAMS, "No se ha recibido el parametro id para buscar al documento", "No se recibio req.params.pid", errorTypesCodes.TYPE_DATA);
        }
        const result = await petsService.delete(petId);
        if (result === null) {
            logger.debug(errorTypes.DELETE_ERROR)
            CustomError.generateError(errorTypes.DELETE_ERROR, `Error en la eliminacion de la mascota con id ${petId}`, "No se pudo eliminar un documento de Pets", errorTypesCodes.NOT_FOUND)
        }
        res.status(200).send({ status: "success", message: "pet deleted" });
    } catch (error) {
        logger.warn(error.message);
        next(error);
    }
}

const createPetWithImage = async (req, res, next) => {
    try {
        const file = req.file;
        const { name, specie, birthDate } = req.body;
        if (!name || !specie || !birthDate || !file) {
            logger.debug(errorTypes.PARAMS);
            CustomError.generateError(errorTypes.PARAMS, "Campos incompletos para crear la mascota con imagen", "Campos vacios o incompletos", errorTypesCodes.INVALID_DATA);
        }
        const pet = PetDTO.getPetInputFrom({
            name,
            specie,
            birthDate,
            image: `${__dirname}/../public/img/${file.filename}`
        });
        if (typeof pet.name !== "string" || typeof pet.specie !== "string" || typeof pet.birthDate !== "string") {
            logger.debug(errorTypes.DTO);
            CustomError.generateError(errorTypes.DTO, "Error en la creacion del DTO", "Error con el DTO", errorTypesCodes.DATA)
        }
        const result = await petsService.create(pet);
        if (!result) {
            logger.debug(errorTypes.CREATE)
            CustomError.generateError(errorTypes.CREATE, "Hubo un error en la creacion de la mascota", "Error en createPet", errorTypesCodes.createError)
        }
        res.status(201).send({ status: "success", payload: result });
    } catch (error) {
        logger.warn(error.message);
        next(error);
    };
};

export default {
    getAllPets,
    createPet,
    updatePet,
    deletePet,
    createPetWithImage
};