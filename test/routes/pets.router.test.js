import { expect } from "chai";
import { after, describe, it, before } from "mocha";
import supertest from "supertest";
import mongoose, { isValidObjectId } from "mongoose";
import {generatePet} from "../../src/mocks/petMocks.js";
import { logger } from "../../src/utils/logger.js";
import { connectDBtest } from "../utils/utils_test.js";

process.loadEnvFile("./src/config/.env.test")
const requester = supertest(`http://localhost:${process.env.PORT}`);

describe("Pets router TEST", function () {
    this.timeout(10_000);
    this.petId;

    before(async function () {
        try {
            await connectDBtest(process.env.MONGO_URL);
            this.petMock = generatePet();
            logger.info("COMENZANDO CICLO DE TEST")
        } catch (error) {
            logger.error("PETS ROUTER test Error - before", error)
        };
    });
    after(async () => {
        try {
            await mongoose.connection.collection("pets").deleteMany();
            await mongoose.connection.close();   
            logger.info("CICLO DE TEST FINALIZADO")
        } catch (error) {
            logger.error("PETS ROUTER test error - after", error)
        };
    });

    it("Test /api/pets - method POST - Create pet", async function () {
        logger.info("Iniciando createPet method test");
        let {body, status} = await requester.post("/api/pets").send(this.petMock);
        this.petId = body.payload._id;

        expect(body).to.has.property("status").and.to.be.eq("success");
        expect(body).to.has.property("payload");
        expect(body.payload).to.has.property("name").and.to.be.a("string").and.to.be.eq(this.petMock.name);
        expect(body.payload).to.has.property("specie").and.to.be.a("string").and.to.be.eq(this.petMock.specie);
        expect(body.payload).to.has.property("birthDate").and.to.be.a("string");
        expect(body.payload).to.has.property("_id").and.to.be.a("string");
        expect(body.payload).to.has.property("__v").and.to.be.a("number");
        expect(body.payload).to.has.property("adopted").and.to.be.a("boolean");
        expect(isValidObjectId(body.payload._id)).to.be.true;
        expect(status).to.be.eq(201);
    });

    it("Test /api/pets - method GET - get all pets", async () => {
        logger.info("Iniciando getAllPets method test");
        let {body, status} = await requester.get("/api/pets");
        
        expect(body).to.has.property("status").and.to.be.eq("success");
        expect(body).to.has.property("payload");
        expect(Array.isArray(body.payload)).to.be.true;
        expect(status).to.be.equal(200);
        if(body.payload.length > 0){
            body.payload.forEach((pet) => {
                expect(pet).to.has.property("_id").and.to.be.a("string");
                expect(pet).to.has.property("name").and.to.be.a("string");
                expect(pet).to.has.property("specie").and.to.be.a("string");
                expect(pet).to.has.property("birthDate").and.to.be.a("string");
                expect(pet).to.has.property("adopted").and.to.be.a("boolean");
                expect(pet).to.has.property("__v").and.to.be.a("number");
            });
        };
    });

    it("Test /api/pets/:pid - method PUT - updatePet", async function () {
        logger.info("Iniciando updatePet method test");
        let petMockUpdated = generatePet();
        let {body, status} = await requester.put(`/api/pets/${this.petId}`).send({name: "nameTest", specie: "specieTest", birthDate: petMockUpdated.birthDate});

        expect(body).to.has.property("status").and.to.be.eq("success");
        expect(body).to.has.property("message").and.to.be.eq("pet updated");
        expect(body).to.has.property("payloadPet").and.to.be.an("object");
        expect(body.payloadPet).to.has.property("_id").and.to.be.a("string");
        expect(isValidObjectId(body.payloadPet._id)).to.be.true;
        expect(body.payloadPet).to.has.property("name").and.to.be.a("string").and.to.be.equal("nameTest");
        expect(body.payloadPet).to.has.property("specie").and.to.be.a("string").and.to.be.eq("specieTest");
        expect(body.payloadPet).to.has.property("birthDate").and.to.be.a("string");
        expect(body.payloadPet).to.has.property("adopted").and.to.be.a("boolean");
        expect(body.payloadPet).to.has.property("__v").and.to.be.a("number");
        expect(status).to.be.eq(200);
    });

    it("Test /api/pets/:pid - method DELETE - deletePet", async function () {
        logger.info("Iniciando deletePet method test");
        let {body, status} = await requester.delete(`/api/pets/${this.petId}`);

        expect(body).to.has.property("status").and.to.be.eq("success");
        expect(body).to.has.property("message").and.to.be.eq("pet deleted");
        expect(status).to.be.eq(200);
    });
});