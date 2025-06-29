import mongoose from "mongoose";
import { logger } from "../../src/utils/logger.js";

export async function connectDBtest(uri_mongo) {
    try {
        await mongoose.connect(uri_mongo);
        logger.debug("Connect DB success")
    } catch (error) {
        console.log("Error al conectar a la bade de datos", error)
    };
};