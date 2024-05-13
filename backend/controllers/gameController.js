import asyncHandler from "express-async-handler";
import Game from "../models/gameModel.js";
import Division from "../models/divisionModel.js";
import Tournament from "../models/tournamentModel.js";
import User from "../models/userModel.js";
import mongoose from 'mongoose';
const {ObjectId} = mongoose.Types;


// @desc    create game
// route    POST /api/games/create
// @access  Private only admin and dev
const createGame = asyncHandler(async (req, res, next) => {
    const {
        player1, 
        player2, 
        instructions, 
        expirationDate, 
        divisionId,
        tournamentId
    } = req.body;
    const userId = req.user._id;

    if(!player1 || !player2 || !expirationDate){
        res.status(400);
        throw new Error("Enter all the required fields")
    }

    const division = await Division.findById(divisionId);
    if(division){
        const new_game = await Game.create({
            player1,
            player2,
            instructions,
            expirationDate,
            divisionId,
            tournamentId,
            userId
        });
        division.games = [...division.games, new_game._id];
        
        await division.save();
        res.status(200).json(new_game);
        
    }else{
        res.status(400);
        throw new Error("Division not found ! ID Invalid")
    }

});

// @desc    delete game
// route    POST /api/games/delete
// @access  Private only admin and dev
const deleteGame = asyncHandler(async (req, res, next) => {
    const {id} = req.body;
    const game = await Game.findById(id);
    if(game){
        game.deleted = true
        const respond = await game.save();
        if(respond){
            res.status(200).json({message: "Game deleted"});
        }else{
            res.status(400);
            throw new Error("Error! Deleting a Game")
        }
    }else{
        res.status(400);
        throw new Error("Game not found ! Id Invalid Error")
    }
});

// @desc    completely erase or delete game
// route    DELETE /api/games/delete
// @access  private only admin and dev
const eraseGame = asyncHandler(async (req, res, next) => {
    const {id} = req.body;
    const game = await Game.findById(id);
    if(game){
        const division = await Division.findById(game.divisionId);
        if(division){
            division.games = division.games.filter((item) => item !== game._id);
            const isremoved = await division.save();
           
            if(isremoved){
                await Game.findByIdAndDelete(id);
                res.status(200).json({message: "Game Erased"});
            }else{
                res.status(400);
                throw new Error("Error! couldn't remove element in game lists")
            }
        }
    }else{
        res.status(400);
        throw new Error("Division not found ! Id Invalid Error")
    }
});

// @desc    get all games
// route    GET /api/games/games
// @access  public
const getGames = asyncHandler( async (req, res, next) => {
    const games = await Game.find({deleted: false});

    if(games){
        res.status(200).json(games);
    }else{
        res.status(400);
        throw new Error("Error, Try again")
    }
});
// @desc    get a single game
// route    GET /api/games/single/:id
// @access  public
const getGame = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
  //   console.log(id);
  
    const game = await Game.findById(id);
    if (game) {
      res.status(200).json(game);
    }else{
      res.status(404)
      throw new Error("Error! Division not found , ID invalid")
    }
});

// @desc    validate game ( update score)
// route    POST /api/games/validate
// @access  private member(player1 or player2), admin or dev
const validateGame = asyncHandler(async (req, res, next) => {
    const {id, score, gameLinks} = req.body;
    const user_id = req.user._id;
    const game = await Game.findById(id);

    if(game){
        game.score = `${score[0]}-${score[1]}`
        game.gameLinks = gameLinks
        game.updatedBy = user_id
        
        const division = await Division.findById(game.divisionId);
        if(division){
            if(
                user_id.toString() !== game.player1.toString() && user_id.toString() !== game.player2.toString() && 
                req.user.role !== "admin" && req.user.role !== "dev"
            ){
                res.status(400);
                throw new Error("Error! Don't have the access permission to do this")
            }
            let p1 = division.participants.filter((item) => item._id.toString() === game.player1.toString())
            let p2 = division.participants.filter((item) => item._id.toString() === game.player2.toString())

            p1.point = parseFloat(score[0]);
            p2.point = parseFloat(score[1]);

            division.participants = division.participants.filter((item) => (item._id.toString() !== game.player2.toString() || item._id.toString() !== game.player1.toString()));
            division.participants = [...division.participants, p1, p2];

            await division.save();
            await game.save();
            res.status(200).json({message: "game updated", game});
        }else{
            res.status(400)
            throw new Error("ID Invalid! Error, Division not found.");
        }
    }else{
        res.status(400)
        throw new Error("ID Invalid! Error, Game not found.");
    }
})

export {
    createGame,
    deleteGame,
    eraseGame,
    getGames,
    getGame,
    validateGame
}