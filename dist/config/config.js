"use strict";
// JWT Configsmodule.exports =
const SERVER_VERIFY_INFO = {
    access: {
        name: "RS_AST",
        secret_key: "$RsSrTeEpAoMlDeEvVeEdLmOaPeEsRrS:AcCeSs20020320:STPREPOLEVED",
        expire: "1h", //1m , 1h, 1d, 1y
        issuer: "rsteam_developers",
        subject: "access_token_test",
    },
    refresh: {
        name: "RS_RFT",
        secret_key: "$RsSrTeEpAoMlDeEvVeEdLmOaPeEsRrS:refresh20020320:STPREPOLEVED",
        expire: "1d",
        issuer: "rsteam_developers",
        subject: "refresh_token_test",
    },
};

/**
 * /Models/Messages_Models.js
 * 로그 기록 여부 플래그
 * 0 = 기록안함
 * 1 = console.log로 출력
 * 2 = RS_Log_Models._log_store의 옵션을 따름
 */

const SERVER_HTTP_PORT = process.env.NODE_ENV === "production" ? 4003 : 4003;
const SERVER_HTTPS_PORT = process.env.NODE_ENV === "production" ? 443 : 3000;

var SERVER_INFO = {
    name: "React Build file test",
    version: 1.0,
    description: "React Build file test Server",
    state: 0,
    startdate: 0,
};

module.exports = {
    SERVER_INFO,
    SERVER_VERIFY_INFO,
    SERVER_HTTP_PORT,
    SERVER_HTTPS_PORT,
};
