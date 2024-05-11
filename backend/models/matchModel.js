import mongoose from 'mongoose';

const matchSchema = mongoose.Schema({
    player1: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "player 1 Id is required!"]
    },
    player2: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "player 2 Id is required!"]
    },
    instructions: {
        type: String,
        default: "Must play 2 matches (format 10min + 5sec)",
    },
    deleted: {type: Boolean, default: false},
    // player two validate a game
    validation1: {
        type: Boolean,
        default: false
    },
    // player one validate a game
    validation2: {
        type: Boolean,
        default: false
    },
    expirationDate: {
        type: Date
    },
    gameLinks: [],
    score: {
        type: String,
        defeault: "0-0"
    }
}, {timestamps: true});

const Match = mongoose.model("Match", matchSchema);

export default Match;