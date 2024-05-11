import mongoose from "mongoose";

const DivisionSchema = mongoose.Schema({
    name: { 
    type: String, 
    required: [true, "Division name is required"] 
    },
    participants: [],
    deleted: {type: Boolean, default: false},
    matches: [],
    userid: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "User Division Author id is required"]
    }
}, {timestamps: true});

const Division = mongoose.model("Division", DivisionSchema);

export default Division;
