import { usersService } from "../services/index.js";
import { createHash, passwordValidation } from "../utils/index.js";
import jwt from 'jsonwebtoken';
import UserDTO from '../dto/User.dto.js';
import { logger } from "../utils/logger.js";
import { errorTypes, errorTypesCodes } from "../middlewares/errorHandler.js";

import { CustomError } from "../utils/CustomError.js";

const register = async (req, res, next) => {
    try {
        const { first_name, last_name, email, password } = req.body;
        if (!first_name || !last_name || !email || !password) {
            logger.debug(errorTypes.BODY);
            CustomError.generateError(errorTypes.SERVER_ERROR, "Se deben completar todos los campos", "Campos incompletos", errorTypesCodes.INVALID_DATA);
        } else if (typeof first_name !== "string" || typeof last_name !== "string" || typeof email !== "string") {
            logger.debug(errorTypes.TYPE_DATA);
            CustomError.generateError(errorTypes.SERVER_ERROR, "El tipo de datos ingresados es invalido", "Los datos no cumplen con los requisitos de tipo", errorTypesCodes.TYPE_DATA);
        };
        const exists = await usersService.getUserByEmail(email);
        if (exists) {
            logger.debug(errorTypes.GET_ERROR)
            CustomError.generateError(errorTypes.SERVER_ERROR, "El correo electronico ya se encuentra en uso", "Dato repetido", errorTypesCodes.INVALID_DATA);
        };
        const hashedPassword = await createHash(password);
        const user = {
            first_name,
            last_name,
            email,
            password: hashedPassword
        }
        let result = await usersService.create(user);
        if (!result) {
            logger.debug(errorTypes.CREATE);
            CustomError.generateError(errorTypes.SERVER_ERROR, "Error al registrar al usuario", "Error en la creacion del usuario", errorTypesCodes.createError);
        }
        res.send({ status: "success", payload: result._id });
    } catch (error) {
        logger.warn(error.message);
        next(error);
    };
};

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            logger.debug(errorTypes.BODY);
            CustomError.generateError(errorTypes.SERVER_ERROR, "Campos incompletos para login", "Los campos ingresados en el login estan incompletos", errorTypesCodes.INVALID_DATA);
        };
        const user = await usersService.getUserByEmail(email);
        if (!user) {
            logger.debug(errorTypes.GET_ERROR);
            CustomError.generateError(errorTypes.SERVER_ERROR, "No se encontro usuario en la base de datos con el mail ingresado", "El email no existe en la base de datos", errorTypesCodes.getError);
        };
        const isValidPassword = await passwordValidation(user, password);
        if (!isValidPassword) {
            logger.debug(errorTypes.AUTENTICATION);
            CustomError.generateError(errorTypes.SERVER_ERROR, "Error en el proceso de autenticacion", "Contraseña incorrecta", errorTypesCodes.AUTENTICACION);
        };
        const userDto = UserDTO.getUserTokenFrom(user);
        if (!userDto.name || !userDto.role || !userDto.email) {
            logger.debug(errorTypes.DTO);
            CustomError.generateError(errorTypes.SERVER_ERROR, "Error en el DTO", "Error en el DTO", errorTypesCodes.INTERNAL_SERVER_ERROR)
        };
        const token = jwt.sign(userDto, 'tokenSecretJWT', { expiresIn: "1h" });
        res.cookie('coderCookie', token, { maxAge: 3600000 }).send({ status: "success", message: "Logged in"});
    } catch (error) {
        logger.warn(error.message)
        next(error);
    };
};

const current = async (req, res, next) => {
    try {
        const cookie = req.cookies['coderCookie']
        if(!cookie) {
            logger.debug(errorTypes.COOKIE);
            CustomError.generateError(errorTypes.SERVER_ERROR, "La cookie esta vacia", "req.cookies esta vacio", errorTypesCodes.NOT_FOUND)
        }
        const user = jwt.verify(cookie, 'tokenSecretJWT');
        if (!user || user === undefined){
            logger.debug(errorTypes.TOKEN);
            CustomError.generateError(errorTypes.SERVER_ERROR, "No hay token JWT", "El token jwt no existe o expiro", errorTypesCodes.NOT_FOUND);
        };
        res.send({ status: "success", payload: user })
    } catch (error) {
        logger.warn(error.message);
        next(error);
    };
};

const unprotectedLogin = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).send({ status: "error", error: "Incomplete values" });
    const user = await usersService.getUserByEmail(email);
    if (!user) return res.status(404).send({ status: "error", error: "User doesn't exist" });
    const isValidPassword = await passwordValidation(user, password);
    if (!isValidPassword) return res.status(400).send({ status: "error", error: "Incorrect password" });
    const token = jwt.sign(user, 'tokenSecretJWT', { expiresIn: "1h" });
    res.cookie('unprotectedCookie', token, { maxAge: 3600000 }).send({ status: "success", message: "Unprotected Logged in" })
}
const unprotectedCurrent = async (req, res) => {
    const cookie = req.cookies['unprotectedCookie']
    const user = jwt.verify(cookie, 'tokenSecretJWT');
    if (user)
        return res.send({ status: "success", payload: user })
}
export default {
    current,
    login,
    register,
    current,
    unprotectedLogin,
    unprotectedCurrent
}