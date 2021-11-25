"use strict";

/************* include library **************/
var createError = require("http-errors");
var express = require("express");
var path = require("path");
var logger = require("morgan");
const root = express();

/************* view engine setup **************/
//root.set("views", path.join(__dirname, "../views"));
root.set("view engine", "ejs");
root.engine("html", require("ejs").renderFile);
root.use(logger("dev"));
root.use(express.json());
root.use(express.urlencoded({ extended: false }));
root.use(express.static(path.join(__dirname, "../views/bundle")));

/************* Routing **************/
root.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../views/bundle/index.html"));
});

//catch 404 and forward to error handler
// web.use(function (req, res, next) {
//     next(createError(404));
// });

// error handler
// web.use(function (err, req, res) {
//     // set locals, only providing error in development
//     res.locals.message = err.message;
//     res.locals.error = req.web.get("env") === "development" ? err : {};

//     // render the error page
//     res.status(err.status || 500);
//     res.render("error.html");
// });

module.exports = root;
