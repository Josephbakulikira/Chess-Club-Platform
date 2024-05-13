import asyncHandler from "express-async-handler";
import Game from "../models/gameModel.js";
import Division from "../models/divisionModel.js";
import Tournament from "../models/tournamentModel.js";
import mongoose from "mongoose";
const {ObjectId} = mongoose.Types;

// @desc    create tournament
// route    POST /api/tournaments/create
// @access  Private only admin and dev
const createTournament = asyncHandler(async (req, res, next) => {
  const { name, divisions, description } = req.body;
  const author = req.user._id;
  if (!name || !author || !divisions || !description) {
    res.status(400);
    throw new Error("Fill all the required fields");
  }

  const new_tournament = await Tournament.create({
    name,
    divisions,
    author,
    description
  });
  if (new_tournament) {
    res.status(200).json(new_tournament);
  } else {
    res.status(400);
    throw new Error("Invalid Tournament data");
  }
});

// @desc    update tournament
// route    POST /api/tournaments/update
// @access  Private only admin and dev
const updateTournament = asyncHandler(async (req, res, next) => {
  const {id, name, description, isover} = req.body;
  if(!name || !description){
    res.status(400);
    throw new Error("Error! Fill all the required field");
  }
  const tournament = await Tournament.findById(id);
  if(tournament){
    tournament.name = name;
    tournament.description = description;
    tournament.isover = isover;

    await tournament.save();
    res.status(200).json({message: "tournament is updated"})
  }else{
    res.status(400);
    throw new Error("Error! Touranament not found ! id invalid")
  }
});

// @desc    delete tournament
// route    POST /api/tournaments/delete
// @access  Private only admin and dev
const deleteTournament = asyncHandler(async (req, res, next) => {
  const { tournament_id } = req.body;
  const tournament = await Tournament.findById(tournament_id);
  tournament.deleted = true;
  const updatedTournament = await tournament.save();
  if (updatedTournament) {
    res.status(200).json({ message: "Tournament deleted" });
  } else {
    res.status(400);
    throw new Error("Error, Tournament not found");
  }
});

// @desc    get all the tournaments
// route    GEt /api/tournaments/tournaments
// @access  Public
const getTournaments = asyncHandler(async (req, res, next) => {
  const tournaments = await Tournament.find(
    {},
    {
      name: 1,
      divisions: 1,
      winners: 1,
      deleted: 1,
      description: 1,
      isover: 1,
      createdAt: 1,
      updatedAt: 1,
    }
  );
  res.status(200).json(tournaments);
});

// @desc    get a single tournament by their id
// route    GEt /api/tournaments/single/:id
// @access  Public
const getTournament = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
//   console.log(id);

  const tournament = await Tournament.findById(id);
  if (tournament) {
    res.status(200).json({
      name: tournament.name,
      divisions: tournament.divisions,
      winners: tournament.winners,
      deleted: tournament.deleted,
      isover: tournament.isover,
      description: tournament.description,
      createdAt: tournament.createdAt,
      updatedAt: tournament.updatedAt,
    });
  }else{
    res.status(404)
    throw new Error("Error! Tournament not found , ID invalid")
  }
});

// @desc    get a single tournament divisions by their id
// route    Get /api/tournaments/divisions/:id
// @access  Public
const getDivisions = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
  //   console.log(id);
  
    const tournament = await Tournament.findById(id);
    if (tournament) {
        const query = { _id: { $in: tournament.divisions } };
        const divisions = await Division.find(query);
        if(divisions){
            res.status(200).json(divisions);
        }
        else{
            res.status(404);
            throw new Error("Error ! Error getting divisions")
        }
    }else{
      res.status(404)
      throw new Error("Error! Tournament not found , ID invalid")
    }
  });

// @desc    delete completely tournament
// route    DELETE /api/tournaments/delete
// @access  Private only admin and dev
const eraseTournament = asyncHandler(async (req, res, next) => {
  const { tournament_id } = req.body;
  const tournament = await Tournament.findById(tournament_id);
  if (tournament) {
    // delete all sub document and sub collection
    if (tournament.divisions.length > 0) {
      var ids = tournament.divisions;
      var queryDivisionsIds = ids.map(function (id) {
        return new ObjectId(id);
      });
      const divisions = await Division.find({
        _id: { $in: queryDivisionsIds },
      });

      divisions.map((single_division) => {
        var games = single_division.games;
        var games_ids = games.map(function (id) {
          return new ObjectId(id);
        });
        // delete all games in a tournament
        const querygames = { _id: { $in: games_ids } };
        Game.deleteMany(querygames)
          .then((result) => {
            console.log(
              `Games of ${tournament_id} and division ${single_division?._id} are Deleted`
            );
            console.log(JSON.stringify(result)); // This will show the number of removed documents
          })
          .catch((err) => {
            console.error("Error deleting Game's:", err);
          });
      });
    
      // delete all divisions in a tournament
      const queryDivisions = { _id: { $in: queryDivisionsIds } };
      Division.deleteMany(queryDivisions)
        .then((result) => {
          console.log(`Divisions of ${tournament_id} are Deleted`);
          console.log(JSON.stringify(result)); // This will show the number of removed documents
        })
        .catch((err) => {
          console.error("Error deleting divisions:", err);
        });
    }
    await Tournament.findByIdAndDelete(tournament_id);
    res
      .status(200)
      .json({
        message:
          "Tournament is erased, there is no trace of this tournament anymore",
      });
  }else{
    res.status(400);
    throw new Error("ID invalid, Tournament not found")
  }
});

export { 
    createTournament, 
    eraseTournament, 
    deleteTournament, 
    getTournaments, 
    getTournament,
    getDivisions,
    updateTournament
};
