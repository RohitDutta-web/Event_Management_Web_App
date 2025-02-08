import express from "express";
import { registerUser, logIn,logOut } from "../controllers/user.controller.js";
import { authMiddleWare } from "../middleWares/auth.middleWare.js";
const router = express();

router.post("/register", registerUser);
router.post("/login", logIn);
router.get("/logout", logOut);

export default router;