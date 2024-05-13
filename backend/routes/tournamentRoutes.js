import express from 'express';
import { protect, isAdmin } from "../middleware/authMiddleware.js";
import { createTournament, deleteTournament, eraseTournament, getDivisions, getTournament, getTournaments, updateTournament } from '../controllers/tournamentController.js';
const router = express.Router();

router.post("/create", protect, isAdmin, createTournament);
router.post("/update", protect, isAdmin, updateTournament);
router.post("/delete", protect, isAdmin, deleteTournament);

router.get("/tournaments", getTournaments)
router.get("/single/:id", getTournament)
router.get("/get-divisions/:id", getDivisions)

router.delete("/delete", protect, isAdmin, eraseTournament);

export default router;