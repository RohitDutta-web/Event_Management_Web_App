import express from "express";
import { listingEvent, updateEvent, cancelEvent, getAllEvents } from "../controllers/event.controller.js";
import { authMiddleWare } from "../middleware/auth.middleWare.js";
const router = express();

router.post("/enlist", authMiddleWare, listingEvent);
router.patch("/update/:id", authMiddleWare, updateEvent);
router.get("/cancel/:id", authMiddleWare, cancelEvent);
router.get("/getEvents", getAllEvents);

export default router;