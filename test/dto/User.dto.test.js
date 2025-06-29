import UserDTO from "../../src/dto/User.dto.js";
import {describe, it} from "mocha";
import {expect} from "chai";
//import Assert from "assert"

//const assert = Assert.strict;

describe("Pruebas UsersDTO", () => {
    let userMock = {
            first_name: "Ignacio",
            last_name: "Brizuela",
            email: "brinacho@hotmail.com",
            password: "ipa123",
            role: "user"
        }
    //before, etc...?

    it("Si envio un usuario al DTO con las propiedades first_name y last:name, me devuelve un name con la concatenacion de ambos", () => {
        let resultado = UserDTO.getUserTokenFrom(userMock)
        console.log("resultado: ", resultado);

        //assert(resultado.name, `${userMock.first_name} ${userMock.last_name}`)

        expect(resultado).to.has.property("name").and.to.be.eq(`${userMock.first_name} ${userMock.last_name}`);
        expect(resultado.name).to.be.equal(`${userMock.first_name} ${userMock.last_name}`)
    }),

    it("Si envio un usuario al DTO me devuelve una propiedad role", () => {
        let resultado = UserDTO.getUserTokenFrom(userMock)

        expect(resultado).to.has.property("role");
        expect(resultado.role).to.exist;
        expect(resultado.apodo).to.be.undefined;
        console.log(resultado.apodo)
    });
})