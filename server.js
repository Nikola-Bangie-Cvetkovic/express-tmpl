import express from "express";
import winston from "winston";
import morgan from "morgan";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const logLevels = {
    fatal: 0,
    error: 1,
    warn: 2,
    info: 3,
    debug: 4,
    trace: 5,
};

winston.addColors({
    fatal: "red",
    error: "red",
    warn: "yellow",
    info: "green",
    debug: "white",
    trace: "blue",
});

const LOGGER = winston.createLogger({
    levels: logLevels,
    format: winston.format.combine(winston.format.timestamp({format: 'DD-MM-YYYY HH:mm:ss:ms'}),
        winston.format.json(),
        winston.format.colorize({all: true})),
    transports: [new winston.transports.Console(),
        new winston.transports.File({
            filename: "./logs/logs.log",
            options: {encoding: "utf-8"}
        })],
    exceptionHandlers: [new winston.transports.File({filename: "./logs/exceptions.log"})],
    rejectionHandlers: [new winston.transports.File({filename: "./logs/rejections.log"})],
});

const server = express();

class customStream {
    write(message){
        LOGGER.info(message);
    }
}

//MIDDLEWARE
server.use(morgan("combined", {stream: new customStream}));
server.use(cors());
server.use(express.json());

server.get("/api/status", (req, res) => {
    LOGGER.info("Checking the API status: Everything is OK");
    res.status(200).json({
        status: "LIVE",
        message: "The Server is live and running..."
    });
});

//ROUTERS GOES HERE

//
server.listen(process.env.PORT, () => {
    LOGGER.info(`Server is running on port ${process.env.PORT}`);
});
