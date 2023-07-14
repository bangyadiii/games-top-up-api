var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var indexRouter = require("./routes/router");
var usersRouter = require("./routes/users");

var app = express();
const URL = `/api/v1`;

app.use(
    logger(":method :url :status :res[content-length] - :response-time ms")
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(`${URL}/`, indexRouter);
app.use(`${URL}/auth`, usersRouter);

// error handling
//default error / endpoint error
app.use((req, res, next) => {
    const err = new Error("Not Found!");
    err.status = 404;
    next(err);
});
//send error
app.use((error, req, res, next) => {
    const status = false;
    const code = error.status || 500;
    const message = error.message;
    const data = error.data || [];

    res.status(code).json({
        status,
        message,
        data,
    });
});

module.exports = app;
