"use strict";

/************* include library **************/
const express = require("express");
const server = express();
const cors = require("cors");
const http = require("http");
const https = require("https");
const fs = require("fs");
const moment = require("moment");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const nocache = require("nocache");
//const initEventHandler = require("./eventHandler")();

//환경변수
//const dotenv                = require('dotenv');

/************* include Router **************/
//N/A

/************* include Options **************/
const { SERVER_INFO, SERVER_AUTH_INFO, SERVER_HTTP_PORT, SERVER_HTTPS_PORT } = require("./config/config");


/************* include Model **************/
//N/A

/************* Option or Define **************/
server.set("RS_KEY", SERVER_AUTH_INFO);
server.use(cookieParser("secret"));

//server.use(nocache());
server.use(logger("dev"));
server.use(express.json());
server.use(express.urlencoded({ extended: false }));

/************* CORS 설정 **************/
const corsOptions = {
    origin : "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true, // true로 하면 설정한 내용을 response 헤더에 추가 해줍니다.
};

server.use(cors(corsOptions)); // config 추가
//server.options('*', cors(corsOptions));

/************* Root Routing **************/
server.use("/", require("./routers/root"));


/************* Running server **************/
// Start HTTP Server
const httpServer = http.createServer(server);
httpServer.listen(SERVER_HTTP_PORT, () => {
    console.log("http server port : " + SERVER_HTTP_PORT);
    SERVER_INFO.startdate = moment();
    SERVER_INFO.state = 50000;
    console.log(`[(${SERVER_INFO.startdate.format("YYYY-MM-DD hh:mm:ss")}) START SERVER (http port ${SERVER_HTTP_PORT})] >> ${SERVER_INFO.description}...`);
});

//Start HTTPS Server
// const httpsServer = https.createServer(
//     {
//         // key: fs.readFileSync('/etc/letsencrypt/live/rs-team.co.kr/privkey.pem'),
//         // cert: fs.readFileSync('/etc/letsencrypt/live/rs-team.co.kr/fullchain.pem')
//         //rsteam.rs-team.co.kr
//         key: fs.readFileSync("./config/ssl_key/privkey.pem"),
//         cert: fs.readFileSync("./config/ssl_key/fullchain.pem"),
//     },
//     server
// );
// httpsServer.listen(SERVER_HTTPS_PORT, () => {
//     SERVER_INFO.startdate = moment();
//     SERVER_INFO.state = 50000;
//     console.log(`[(${SERVER_INFO.startdate.format("YYYY-MM-DD hh:mm:ss")}) START SERVER (https port ${SERVER_HTTPS_PORT})] >> ${SERVER_INFO.description}...`);
// });
