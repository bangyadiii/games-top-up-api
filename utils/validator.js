const { check } = require("express-validator");

module.exports = {
    login: [
        check("username").notEmpty().isString(),
        check("password").notEmpty().isString(),
    ],
    register: [
        check("email").exists().notEmpty().isEmail(),
        check("password").exists().notEmpty().isString(),
        check("verify_password").exists().notEmpty().isString(),
    ],
};
