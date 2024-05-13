import express from 'express';
import { protect, isAdmin } from "../middleware/authMiddleware.js";
import { createDivision, deleteDivision, eraseDivision, getDivision, getDivisions, getGames, getParticipants, udpateDivision, updateParticipants } from '../controllers/divisionController.js';
const router = express.Router();

router.post("/create", protect, isAdmin, createDivision);
router.post("/delete", protect, isAdmin, deleteDivision);

router.get("/participants/:id", getParticipants);
router.get("/games/:id", getGames);
router.get("/divisions", getDivisions);
router.get("/single/:id", getDivision)

router.delete("/delete", protect, isAdmin, eraseDivision);

router.put("/update", protect, isAdmin, udpateDivision);
router.put("/participants", protect, isAdmin, updateParticipants);

export default router;