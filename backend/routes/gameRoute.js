import express from 'express';
import { protect, isAdmin, isMember} from "../middleware/authMiddleware.js";
import { createGame, deleteGame, eraseGame, getGame, getGames, validateGame } from '../controllers/gameController.js';
const router = express.Router();

router.post("/create", protect, isAdmin, createGame);
router.post("/delete", protect, isAdmin, deleteGame);
router.post("/validate", protect, isAdmin, isMember, validateGame);

router.delete("/delete", protect, isAdmin, eraseGame);

router.get("/games", getGames);
router.get("/single/:id", getGame);

export default router;
