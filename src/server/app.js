// import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import { swaggerUi, swaggerDocument } from "../utils/swagger/swagger.js";

import usersRouter from "../routes/users.router.js";
import petsRouter from "../routes/pets.router.js";
import adoptionsRouter from "../routes/adoption.router.js";
import sessionsRouter from "../routes/sessions.router.js";
import mocksRouter from "../routes/mocks.router.js";

import { errorHandler } from "../middlewares/errorHandler.js";  

const app = express();
const MONGO_CONNECT = process.env.MONGO_CONNECT;
const connection = mongoose.connect(MONGO_CONNECT);

app.use(express.json());
app.use(cookieParser());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use("/api/users", usersRouter);
app.use("/api/pets", petsRouter);
app.use("/api/adoptions", adoptionsRouter);
app.use("/api/sessions", sessionsRouter);
app.use("/api/mocks", mocksRouter);

app.use(errorHandler);  

export default app;