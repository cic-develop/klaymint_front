"use strict";

module.exports = function initEventHandler() {
    console.log("init Event Handler");
    /**
     * NodeJS Detect Interrupted Handler
     **/
    //catches ctrl+c event
    process.on("SIGINT", (e) => eventHandler(e));
    process.on("SIGTERM", (e) => eventHandler(e));

    //catches "kill pid" (for example: nodemon restart)
    process.on("SIGUSR1", (e) => eventHandler(e));
    process.on("SIGUSR2", (e) => eventHandler(e));

    //catches uncaught exceptions
    //process.on('uncaughtException', (e) => this.eventHandler(e));

    /**
     * NodeJS Event Handler
     **/
    //do something when app is closing
    process.on("exit", (e) => {
        exitHandler(e);
    });

    var exitHandler = function (e) {
        console.log(`[STOP SERVER (${new Date()})] exitcode: ${e}`);
    };

    var eventHandler = function (e) {
        switch (e) {
            default:
                console.log("[Detect Interrupted] >> Unkown Signal");
                break;
            case "SIGTERM":
            case "SIGINT":
                console.log("[Detect Interrupted] >> catches ctrl+c event");
                process.exit(1);

            case "SIGUSR1":
            case "SIGUSR2":
                console.log("[Detect Interrupted] >> kill pid");
                process.exit(2);

            case "uncaughtException":
                console.log("[Detect Interrupted] >> uncaughtException");
                process.exit(3);
        }
    };
};
