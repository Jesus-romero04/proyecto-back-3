import { Command } from "commander";
import dotenv from "dotenv";

const program = new Command();

program
    .option("--mode <mode>", "Modo de trabajo", "development")
    .option("-p <port>", "Puerto del servidor", 8080)
program.parse()


function dotenvPath () {
    let path;
    switch(program.opts().mode){
        case "production":
            path = "./src/config/.env.production";
            break
        case "development":
            path = "./src/config/.env.development";
            break
        case "testing":
            path = "./src/config/.env.test"
        default:
            break
    }
    return path;
};

dotenv.config({
    // path: enviroment === "production" ? "./src/config/.env.production" : "./src/config/.env.development"
    path: dotenvPath()
});

export default {
    port: process.env.PORT,
    mongoURL: process.env.MONGO_URL,
    cookieCode: process.env.COOKIE_VALUE,
    enviroment: program.opts().mode 
}