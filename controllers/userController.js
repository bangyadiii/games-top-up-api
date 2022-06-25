const { validationResult } = require("express-validator");
const model = require("../models");
const log = require("../utils/logs");
const { User } = require("../models");

async function login(req, res, next) {
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return res.status(400).json({
            status: false,
            message: "Login failed.",
            errors: error.array(),
        });
    }

    const { username, password } = req.body;

    try {
        const user = await User.find({ username: username });

        if (user === null)
            return res.status(400).json({
                status: false,
                message: "User with this username not found.",
                data: [],
            });

        if (password !== "triadi123") {
            return res.status(400).json({
                status: false,
                message: "Password doesn't match.",
                data: [],
            });
        }
        res.status(200).json({
            status: true,
            message: "Login successfully",
            data: [
                {
                    user: user,
                },
            ],
        });
    } catch (e) {
        next(e);
    }
}
async function register(req, res, next) {
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return res.status(400).json({
            status: false,
            message: "Register failed.",
            errors: error.array(),
        });
    }
    try {
        const user = await User.create(req.body);

        if (user === null)
            return res.status(400).json({
                status: false,
                message: "Register failed.",
                errors: error.array(),
            });

        res.status(200).json({
            status: true,
            message: "Register successfully",
            data: [
                {
                    user: user,
                },
            ],
        });
    } catch (e) {
        next(e);
    }
    //
}
function getCurrentUser(req, res, next) {
    //
}

module.exports = { getCurrentUser, login, register };
