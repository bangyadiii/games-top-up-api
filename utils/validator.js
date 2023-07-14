const { check } = require("express-validator");

module.exports = {
    login: [
        check("username").trim().notEmpty().isString(),
        check("password").trim().notEmpty().isString(),
    ],
    register: [
        check("email").trim().exists().notEmpty().isEmail(),
        check("password")
            .trim()
            .exists()
            .notEmpty()
            .isString()
            .isLength({ min: 6 }),
        check("verify_password")
            // To delete leading and trailing space
            .trim()

            // Validate minimum length of password
            // Optional for this context
            .isLength({ min: 6 })

            // Custom message
            .withMessage("Password min char is 6")

            // Custom validation
            // Validate confirmPassword
            .custom(async (verify_password, { req }) => {
                const password = req.body.password;

                // If password and confirm password not same
                // don't allow to sign up and throw error
                if (password !== verify_password) {
                    throw new Error("Passwords must be same");
                }
            }),
    ],
};
