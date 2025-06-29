import { Router } from "express";
import mockingController from "../controllers/mocks.controller.js"

const mocksRouter = Router();

mocksRouter.get("/mockingpets", mockingController.createMockingPet);
mocksRouter.get("/mockingusers", mockingController.createMockingUser);

mocksRouter.post("/generateData", mockingController.generateData)

export default mocksRouter;