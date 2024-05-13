import mongoose from 'mongoose';

const gameSchema = mongoose.Schema({
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
    isplayed: {
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
    },
    divisionId: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "Division Id is required"]
    },
    tournamentId: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "Tournament Id is required"]
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "User id is required"]
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
    }
}, {timestamps: true});

const Game = mongoose.model("Game", gameSchema);

export default Game;