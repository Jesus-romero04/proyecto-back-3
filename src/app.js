// src/app.js
import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import usersRouter from './routes/users.router.js';
import petsRouter from './routes/pets.router.js';
import adoptionsRouter from './routes/adoption.router.js';
import sessionsRouter from './routes/sessions.router.js';
import loggerRouter from './routes/logger.router.js';
import mocksRouter from './routes/mocks.router.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { addLogger } from './middlewares/addLogger.js';
import { swaggerUi, swaggerSpecs } from './docs/swaggerConfig.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(addLogger);

// Documentación Swagger
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// Rutas de API
app.use('/api/users', usersRouter);
app.use('/api/pets', petsRouter);
app.use('/api/adoptions', adoptionsRouter);
app.use('/api/sessions', sessionsRouter);
app.use('/loggerTest', loggerRouter); 
app.use('/api/mocks', mocksRouter);

// Middleware de errores
app.use(errorHandler);

export default app;
