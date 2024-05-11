import express from 'express';
import { protect, isAdmin } from "../middleware/authMiddleware.js";
import { createTournament, deleteTournament, eraseTournament, getTournaments } from '../controllers/tournamentController.js';
const router = express.Router();

router.post("/create", protect, isAdmin, createTournament);
router.get("/tournaments", getTournaments)
router.post("/delete", protect, isAdmin, deleteTournament);
router.delete("/delete", protect, isAdmin, eraseTournament);

export default router;