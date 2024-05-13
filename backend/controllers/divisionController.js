import asyncHandler from "express-async-handler";
import Game from "../models/gameModel.js";
import Division from "../models/divisionModel.js";
import Tournament from "../models/tournamentModel.js";
import User from "../models/userModel.js";
import mongoose from 'mongoose';
const {ObjectId} = mongoose.Types;

// @desc    create division
// route    POST /api/divisions/create
// @access  Private only admin and dev
const createDivision = asyncHandler(async (req, res, next) => {
    const { name, tournamentId } = req.body;
    const userId = req.user._id;

    const tournament = await Tournament.findById(tournamentId)

    if (!name || !userId || !tournamentId) {
        res.status(400);
        throw new Error("Fill all the required fields");
    }

    if(tournament){
        const new_division = await Division.create({
            name,
            tournamentId,
            userId
        });
    
        if(new_division){
            tournament.divisions = [...tournament.divisions, new_division._id]
            const waitingForResponse = await tournament.save();
            if (new_division && waitingForResponse) {
                res.status(200).json(new_division);
            } else {
                await Division.findByIdAndDelete(new_division?._id)
                res.status(400);
                throw new Error("Invalid Division data");
            }
        }
    }else{
        res.status(400);
        throw new Error("Invalid Tournament data");
    }
});

// @desc    get all divisions
// route    GET /api/divisions/divisions
// @access  public
const getDivisions = asyncHandler( async (req, res, next) => {
    const divisions = await Division.find({deleted: false}, {
        name: 1, 
        _id: 1,
        tournamentId: 1,
        participants: 1,
        deleted: 1,
        games: 1,
        createdAt: 1,
        updatedAt: 1
    });

    if(divisions){
        res.status(200).json(divisions);
    }else{
        res.status(400);
        throw new Error("Error, Try again")
    }
});
// @desc    get a single division
// route    GET /api/divisions/single/:id
// @access  public
const getDivision = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
  //   console.log(id);
  
    const division = await Division.findById(id);
    if (division) {
      res.status(200).json({
        _id: division._id,
        name: division.name,
        tournamentId: division.tournamentId,
        participants: division.participants,
        deleted: division.deleted,
        games: division.games,
        createdAt: division.createdAt,
        updatedAt: division.updatedAt
      });
    }else{
      res.status(404)
      throw new Error("Error! Division not found , ID invalid")
    }
  });

// @desc    get all the division participants
// route    GET /api/divisions/get-participants
// @access  public
const getParticipants = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
  //   console.log(id);
  
    const division = await Division.findById(id);
    if (division) {
        var participant_ids = division.participants.map(function (item) {
            return ObjectId(item);
          });
          // delete all games in a tournament
        const query = { _id: { $in: participant_ids } };
        const participants = await User.find(query);
        res.status(200).json(participants);
    }else{
      res.status(404)
      throw new Error("Error! Division not found , ID invalid")
    }
  });

// @desc    get all the division games
// route    GET /api/divisions/get-games
// @access  public
const getGames = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    // console.log(id);
  
    const division = await Division.findById(id);
    if (division) {
        var game_ids = division.games.map(function (item) {
            return ObjectId(item);
          });
          // delete all games in a tournament
        const query = { _id: { $in: game_ids } };
        const games = await Game.find(query);
        res.status(200).json(games);
    }else{
      res.status(404)
      throw new Error("Error! Division not found , ID invalid")
    }
  });

// @desc    delete division
// route    POST /api/divisions/delete
// @access  private only admin and dev
const deleteDivision = asyncHandler(async (req, res, next) => {
    const {id} = req.body;
    const division = await Division.findById(id);
    if(division){
        division.deleted = true
        const respond = await division.save();
        if(respond){
            res.status(200).json({message: "Division deleted"});
        }else{
            res.status(400);
            throw new Error("Error! Deleting a division")
        }
    }else{
        res.status(400);
        throw new Error("Division not found ! Id Invalid Error")
    }
});

// @desc    completely erase or delete division
// route    DELETE /api/divisions/delete
// @access  private only admin and dev
const eraseDivision = asyncHandler(async (req, res, next) => {
    const {id} = req.body;
    const division = await Division.findById(id);
    if(division){
        const tournament = await Tournament.findById(division.tournamentId);
        if(tournament){
            tournament.divisions = tournament.divisions.filter((item) => item !== division._id);
            const isremoved = await tournament.save();
            var game_ids = division.games.map(function (item) {
                return new ObjectId(item);
              });
            if(isremoved){
                const query = { _id: { $in: game_ids } };
                await Game.deleteMany(query);
                await Division.findByIdAndDelete(id);
                res.status(200).json({message: "Division Erased"});
            }else{
                res.status(400);
                throw new Error("Error! couldn't remove element in tournament division lists")

            }
        }
        
    }else{
        res.status(400);
        throw new Error("Division not found ! Id Invalid Error")
    }
});

// @desc    update division (update division name)
// route    PUT /api/divisions/update
// @access  private only admin and dev
const udpateDivision = asyncHandler(async (req, res, next) => {
    const {name, id} = req.body;
    if(!name){
        res.status(400);
        throw new Error("Fill the required fields");
    }
    const division = await Division.findById(id);
    if(division){
        division.name = name;
        await division.save();
        res.status(200).json({
            message: "division updated",
            division: division,
        })
    }
});

// @desc    add participants in division (update division)
// route    PUT /api/divisions/participants
// @access  private only admin and dev
const updateParticipants = asyncHandler(async (req, res, next) => {
    const {participants, id} = req.body;
    if(!participants){
        res.status(400);
        throw new Error("Fill the required fields");
    }
    const division = await Division.findById(id);
    if(division){
        division.participants = participants;
        await division.save();
        res.status(200).json({
            message: "division participants updated",
            division: division,
        });
    }
});

export {
    createDivision,
    getDivisions,
    getDivision,
    deleteDivision,
    eraseDivision,
    udpateDivision,
    updateParticipants,
    getParticipants,
    getGames
};