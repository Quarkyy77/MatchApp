import express from "express";
import { isUserAuthenticated } from "../middlewares/auth";
import { updateUserLocation, getNearbyUsers, requestMatch,  getMatchStatus, markSpam } from "../controllers/user.controller"


const router = express.Router();

router.post("/updateUserLocation", isUserAuthenticated, updateUserLocation);
router.post("/getNearbypeople", getNearbyUsers);
router.post("/requestMatch", isUserAuthenticated, requestMatch);
router.post("/getMatchStatus", isUserAuthenticated, getMatchStatus);
router.post("/markSpam",isUserAuthenticated, markSpam )

export default router;