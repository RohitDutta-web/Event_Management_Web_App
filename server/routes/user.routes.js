import express from "express";
import { registerUser, logIn,logOut, guestLogIn } from "../controllers/user.controller.js";
const router = express();

router.post("/register", registerUser);
router.post("/login", logIn);
router.get("/logout", logOut);
router.get("/guest/login", guestLogIn);

export default router;