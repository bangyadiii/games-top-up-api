function User(mongoose) {
    const userSchema = new mongoose.Schema(
        {
            email: {
                type: String,
                required: true,
                lowercase: true,
            },

            username: {
                type: String,
                required: false,
            },
            password: {
                type: String,
                required: true,
            },
            verified: {
                type: Date,
                required: false,
            },
        },
        { timestamps: true }
    );

    const userModel = mongoose.model("User", userSchema);
    return userModel;
}

module.exports = User;
