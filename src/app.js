import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import config from './config/config.js';

import usersRouter from './routes/users.router.js';
import petsRouter from './routes/pets.router.js';
import adoptionsRouter from './routes/adoption.router.js';
import sessionsRouter from './routes/sessions.router.js';
import mocksRouter from './routes/mocks.router.js';

import { errorHandler } from './middlewares/errorHandler.js';
import { logger, middLogg } from './utils/logger.js';




//Open API specification
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUI from "swagger-ui-express";

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Documentacion de usuarios | User",
            version: "1.0.0",
            description: "Posible texto de descripcion"
        },
        servers: [
            {
                url: "http://localhost:8080",
                description: "development"
            },
            {
                url: "http://localhost:8085",
                description: "production"
            },
            {
                url: "http://localhost:8090",
                description: "tetsing"
            }
        ]
    },
    apis: ["./src/docs/*.yaml"]
}

const specification = swaggerJSDoc(options);
// console.log(specification);




const app = express();
const PORT = process.env.PORT || 8080;
const connection = mongoose.connect(config.mongoURL)

//app.use(middLogg)
app.use(express.json());
app.use(cookieParser());

app.use("/api/mocks", mocksRouter)
app.use('/api/users', usersRouter);
app.use('/api/pets', petsRouter);
app.use('/api/adoptions', adoptionsRouter);
app.use('/api/sessions', sessionsRouter);
//Docs
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specification))

app.get("/loggerTest", (req, res) => {
    try {
        logger.fatal("Error FATAL");
        logger.error("Error ERROR");
        logger.warn("Error WARN");
        logger.info("Error INFO");
        logger.http("Error HTTP");
        logger.debug("Error DEBUG");

        res.send("Se ejecuto loggerTest")
    } catch (error) {
        logger.error("Error capturado en loggertest: ", error)
    }
});

//middleware de errores
app.use(errorHandler)

app.listen(PORT, () => logger.info(`Listening on ${PORT}`))

//Informacion secundaria
logger.info(`Servidor activo en puerto ${config.port}, en entorno de ${config.enviroment}`)
