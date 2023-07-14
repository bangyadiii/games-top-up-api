function User(mongoose) {
    const userSchema = new mongoose.Schema(
        {
            email: {
                type: String,
                required: [true, `The email shouldn't be empty.`],
                lowercase: true,
                unique: true,
            },

            username: {
                type: String,
                require: [true, "Username harus di isi"],
                unique: true,
            },
            password: {
                type: String,
                required: [true, `The password should not be empty.`],
            },
            status: {
                type: String,
                enum: ["Y", "N"],
                default: "Y",
            },
            role: {
                type: String,
                enum: ["admin", "user"],
                default: "user",
            },

            verified: {
                type: Date,
            },
        },
        { timestamps: true }
    );

    const userModel = mongoose.model("User", userSchema);
    return userModel;
}

module.exports = User;
