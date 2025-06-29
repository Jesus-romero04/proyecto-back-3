import { describe, it } from "mocha";
import { expect } from "chai";
import supertest from "supertest";
import mongoose, { isValidObjectId } from "mongoose";
import { generateUser } from "../../src/mocks/userMocks.js";
import { logger } from "../../src/utils/logger.js";
import { connectDBtest } from "../utils/utils_test.js";

process.loadEnvFile("./src/config/.env.test")
const requester = supertest(`http://localhost:${process.env.PORT}`);

describe("Sessions router TEST", function () {
    this.timeout(10_000);
    this.cookie;
    this.userMock;
    this.loginUserMock;
    this.InvalidUserMock = {
        first_name: "",
        last_name: "Perez",
        email: "test@test.com",
        password: "1234",
        role: "user"
    }
    this.genericTestPassword = "coder123";
    before( async function () {
        try {
            await connectDBtest(process.env.MONGO_URL);
            this.userMock = await generateUser(); 
            this.loginUserMock = {
                email: this.userMock.email,
                password: this.userMock.password
            };
            logger.debug("INICIANDO CICLO DE TEST");
        } catch (error) {
            logger.error("Error en before - sessions router test", error)
        }
    });
    after(async function () {
        try {
            // Habilitar la siguiente linea solo para testear individualmente este archivo de teest: 
                //await mongoose.connection.collection("users").deleteMany({email: this.userMock.email});
            await mongoose.connection.close();
            logger.debug("CICLO DE TEST FINALIZADO");
        } catch (error) {
            logger.error("Error en after - sessions router test");
        }
    });

    it("Test /api/sessions/register - method POST - Validate response", async function () {
        logger.info("Iniciando register method test")
        let {body, status} = await requester.post("/api/sessions/register").send(this.userMock);

        expect(body).to.has.property("status").and.to.be.eq("success");
        expect(body).to.has.property("status").and.to.not.equal("error");
        expect(body).to.has.property("payload");
        expect(isValidObjectId(body.payload)).to.be.true;
        expect(status).to.be.eq(200);
    });
    it("Test /api/sessions/login - method POST - Create cookie", async function () {
        logger.info("Iniciando login method test");
        let {body, status, headers} = await requester.post("/api/sessions/login").send(this.loginUserMock);
        
        this.cookie = headers["set-cookie"];
        let nombreCookie = this.cookie[0].split("=")[0];

        expect(nombreCookie).to.be.eq("coderCookie")
        expect(body).to.have.property("status").and.to.be.eq("success");
        expect(body).to.have.property("message").and.to.be.eq("Logged in");
        expect(nombreCookie).to.be.eq("coderCookie");
        expect(status).to.be.eq(200);
    });
    it("Test /api/sessions/current - method GET - Vallidate cookie", async function () {
        logger.info("Iniciando current method test");
        let {body, status} = await requester.get("/api/sessions/current").set("Cookie", this.cookie);

        expect(body).to.have.property("status").and.to.be.equal("success");
        expect(body).to.have.property("payload");
        expect(body.payload).to.have.property("name").to.be.eq(`${this.userMock.first_name} ${this.userMock.last_name}`);
        expect(body.payload).to.have.property("email").to.be.eq(this.userMock.email);
        expect(body.payload).to.have.property("role").to.be.eq(this.userMock.role);
        expect(status).to.be.eq(200);
    });  
});