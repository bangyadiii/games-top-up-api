var express = require("express");
const validator = require("../utils/validator");
const {
    login,
    register,
    getCurrentUser,
} = require("../controllers/userController");
var router = express.Router();

/* GET users listing. */

router.post("/login", validator.login, login);
router.post("/register", validator.register, register);
router.get("/user/:id?", getCurrentUser);

module.exports = router;
