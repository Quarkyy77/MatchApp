import express from "express";
import { register, login, logout } from "../controllers/auth.controller";
import {isBlocked } from "../middlewares/auth"

const router = express.Router();

router.post("/register", register);
router.post("/login", isBlocked, login);
router.get("/logout", logout);

export default router;