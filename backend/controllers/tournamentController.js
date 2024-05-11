import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import Match from "../models/matchModel.js";
import Division from "../models/divisionModel.js";
import Tournament from "../models/tournamentModel.js";

// @desc    create tournament 
// route    POST /api/tournaments/create
// @access  Private only admin and dev
const createTournament = asyncHandler( async (req, res, next) => {
    const {name, divisions} = req.body;
    const author = req.user._id;
    if (!name || !author || !divisions){
        res.status(400);
        throw new Error("Fill all the required fields");
    }

    const new_tournament = await Tournament.create({
        name, divisions, author
    });
    if(new_tournament){
        res.status(200).json(new_tournament)
    }else {
        res.status(400);
        throw new Error("Invalid Tournament data");
    }
});

const deleteTournament = asyncHandler(async (req, res, next) => {
    const {tournament_id} = req.body;
    const tournament = await Tournament.findById(tournament_id);
    tournament.deleted = true
    const updatedTournament = await tournament.save();
    if(updatedTournament){
        res.status(200).json({message: "Tournament deleted"});
    }else{
        res.status(400);
        throw new Error("Error, Tournament not found")
    }
});

const getTournaments = asyncHandler(async (req, res, next) => {
    const tournaments = await Tournament.find({}, {name: 1, divisions: 1, winners: 1, deleted: 1, isover: 1, createdAt: 1, updatedAt: 1});
    res.status(200).json(tournaments);
});

const eraseTournament = asyncHandler(async (req, res, next) => {
    const {tournament_id} = req.body;
    const tournament = await Tournament.findById(tournament_id);
    if(tournament){
        // delete all sub document and sub collection
        if (tournament.divisions.length > 0){
            var ids = tournament.divisions;
            var queryDivisionsIds = ids.map(function(id) { return ObjectId(id); });
            const divisions = await Division.find({_id: {$in: queryDivisionsIds}});
            
            divisions.map((single_division) => {
                var matches = single_division.matches;
                var matches_ids = matches.map(function(id) {return ObjectId(id);});
                // delete all matches in a tournament
                const querymatches = { _id: { $in: matches_ids } };
                Match.deleteMany(querymatches)
                .then(result => {
                    console.log(`Matches of ${tournament_id} and division ${single_division?._id} are Deleted`);
                    console.log(JSON.stringify(result)); // This will show the number of removed documents
                })
                .catch(err => {
                    console.error("Error deleting matches:", err);
                });
            });
                
            
            // delete all divisions in a tournament
            const queryDivisions = { _id: { $in: queryDivisions } };
                Division.deleteMany(queryDivisions)
                .then(result => {
                    console.log(`Divisions of ${tournament_id} are Deleted`);
                    console.log(JSON.stringify(result)); // This will show the number of removed documents
                })
                .catch(err => {
                    console.error("Error deleting divisions:", err);
                });
        }
        await Tournament.findByIdAndDelete(tournament_id)
        res.status(200).json({message: "Tournament is erased, there is no trace of this tournament anymore"})
    }

})

export {createTournament, eraseTournament, deleteTournament, getTournaments};

