import winston from "winston"

let enviroment = "development";

export const logger = winston.createLogger({
    levels: {fatal: 0, error: 1, warn: 2, info: 3, http: 4, debug: 5},
    transports: [
        new winston.transports.Console({
            level: enviroment === "development" ? "debug" : "info",
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.colorize({colors: {fatal: "red", error: "magenta", warn: "yellow", info: "blue", http: "cyan", debug: "grey"}}),
                winston.format.simple()
            )
        }),
        new winston.transports.File({
            level: "error",
            filename: "./src/logs/error.log",
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.simple()
            )
        })
    ]
});

export const middLogg=(req, res, next)=>{
    req.logger=logger

    next()
}