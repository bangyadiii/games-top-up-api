function Game(mongoose) {
    const gameSchema = new mongoose.Schema(
        {
            name: {
                type: String,
                required: true,
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
            },
        },
        { timestamp: true }
    );

    const gameModel = mongoose.model("Game", gameSchema);
    return gameModel;
}

module.exports = Game;
