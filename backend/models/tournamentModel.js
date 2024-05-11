import mongoose from 'mongoose';

const tournamentSchema = mongoose.Schema({
    name: {
        type: String, 
        required: [true, "tournament name is required"],
        unique: true
    },
    divisions: [],
    winners: [],
    deleted: {type: Boolean, default: false},
    author: {
        type: mongoose.Schema.Types.ObjectId, 
        required: [true, "Error, passing the tournament author ID"]
    },
    isover: {
        type: Boolean,
        default: false
    }
},
{timestamps: true});

const Tournament = mongoose.model("Tournament", tournamentSchema);
export default Tournament