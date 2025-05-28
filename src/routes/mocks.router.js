import { Router } from "express";
import { createMockingUsers, createMockingPets } from "../controllers/mocks.controller.js";
import { createDataOnDatabase } from "../controllers/mocks.controller.js";

const router = Router();

router.get("/mockingusers", createMockingUsers);
router.get("/mockingpets", createMockingPets);
router.post("/generateData", createDataOnDatabase)

export default router;