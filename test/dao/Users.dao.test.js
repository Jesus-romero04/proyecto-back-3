import Users from "../../src/dao/Users.dao.js"
import {describe, it} from "mocha";
import Assert from "assert";
import mongoose from "mongoose";
import {logger} from "../../src/utils/logger.js"
import { generateUser } from "../../src/mocks/userMocks.js";
import { connectDBtest } from "../utils/utils_test.js";

process.loadEnvFile("./src/config/.env.test")
const assert = Assert.strict;

describe("Users DAO Test", function(){
    this.timeout(10_000);

    before(async function() {
        try {
            await connectDBtest(process.env.MONGO_URL);
            this.usersDAO = new Users();
            this.userMock = await generateUser();
            this.userEmail = this.userMock.email;
            this.userId;
        } catch (error) {
            logger.error("DAO test Error - before", error)
        };
    });

    after(async function () {
        try {
            await mongoose.connection.collection("users").deleteMany({email: this.userEmail});
            await mongoose.connection.close();
        } catch (error) {
            logger.error("DAO test error - after", error)
        };
    });

    it("save method test - Guardado de usuario", async function () {
        logger.info("Iniciando save test")

        let resultado = await this.usersDAO.save(this.userMock);
        this.userId = resultado._id

        assert.ok(resultado._id)
        assert.ok(mongoose.isValidObjectId(resultado._id))
        assert.ok(resultado.first_name)
        assert.ok(resultado.last_name)
        assert.ok(resultado.email)
        assert.ok(resultado.password)
        assert.ok(resultado.role)
        assert.ok(resultado.pets)

        assert.equal(resultado.first_name, this.userMock.first_name)
        assert.equal(resultado.last_name, this.userMock.last_name)
        assert.equal(resultado.email, this.userMock.email);
        assert.equal(resultado.role, this.userMock.role);
        assert.equal(resultado.password, this.userMock.password);
        if(assert.notEqual(resultado, this.userMock)){
            assert.fail("save method DAO error")
        };
    });

    it("get all users method test - Obtencion de usuarios", async function () {
        logger.info("Iniciando get test")
        let resultado = await this.usersDAO.get();

        assert.equal(Array.isArray(resultado), true);

        if(resultado.length !== 0){
            logger.debug("El array Users contiene usuarios");
            resultado.forEach(user => {
                assert.ok(user._id)
                assert.ok(user.first_name)
                assert.ok(user.last_name)
                assert.ok(user.email)
                assert.ok(user.password)
                assert.ok(user.role)
                assert.ok(user.pets)
            });
        } else {
            logger.debug("El array Users esta vacio");
            assert.ok(resultado.length >= 0);
        };
    });

    it("get one user method test - Obtencion de un usuario", async function () {
        logger.info("Iniciando getBy test")
        let resultado = await this.usersDAO.getBy({_id: this.userId});

        assert.ok(resultado._id);
        assert.ok(resultado.first_name);
        assert.ok(resultado.last_name);
        assert.ok(resultado.email);
        assert.ok(resultado.password);
        assert.ok(resultado.role);
        assert.ok(resultado.pets);
    });

    it("update one user method test - Edicion de un usuario", async function() {
        logger.info("Iniciando update test");
        let updateObject = {
            first_name: "testName",
            last_name: "update exit"
        };
        let resultado = await this.usersDAO.update(this.userId, updateObject);

        assert.ok(resultado._id);
        assert.ok(resultado.first_name);
        assert.ok(resultado.last_name);
        assert.ok(resultado.email);
        assert.ok(resultado.password);
        assert.ok(resultado.role);
        assert.ok(resultado.pets);
        assert.equal(resultado.first_name, updateObject.first_name);
        assert.equal(resultado.last_name, updateObject.last_name);
    });
}) 