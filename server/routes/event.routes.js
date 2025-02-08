import express from "express";
import { listingEvent, updateEvent, cancelEvent } from "../controllers/event.controller.js";
import { authMiddleWare } from "../middleware/auth.middleWare.js";
const router = express();

router.post("/enlist", authMiddleWare, listingEvent);
router.post("/update/:id", authMiddleWare, updateEvent);
router.post("/cancel/:id", authMiddleWare, cancelEvent)

export default router;