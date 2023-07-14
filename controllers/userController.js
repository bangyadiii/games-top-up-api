const { validationResult } = require("express-validator");
const log = require("../utils/logs");
const { User } = require("../models");
var bcrypt = require("bcryptjs");

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
        const user = await User.findOne({ username: username });

        if (user === null)
            return res.status(400).json({
                status: false,
                message: "User with this username not found.",
                data: [],
            });

        const checkPass = await bcrypt.compare(password, user.password);

        if (checkPass) {
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
        const { email, username, password } = req.body;

        const salt = bcrypt.genSaltSync(10);
        const hashed_password = bcrypt.hashSync(password, salt);
        const user = await User.create({
            email: email,
            username: username,
            password: hashed_password,
        });

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
