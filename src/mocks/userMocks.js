import {fakerES_MX as fa} from "@faker-js/faker";
import { createHash } from "../utils/index.js";

async function encriptedPassword () {
    const password = await createHash("coder123");
    return password;
};

export const generateUser = async () => {
    let first_name = fa.person.firstName();
    let last_name = fa.person.lastName();
    let email = fa.internet.email({
        firstName: first_name,
        lastName: last_name,
        provider: "gmail.com"
    });
    let password = await encriptedPassword();
    let role = "user" || "admin";

    return{
        first_name,
        last_name,
        email,
        password,
        role
    }
};