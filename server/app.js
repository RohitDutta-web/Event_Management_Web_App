import express from "express";
import connectToDb from "./config/db.js";
import http from "http";
import { Server } from "socket.io";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.routes.js";
import eventRouter from "./routes/event.routes.js";
dotenv.config({})
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: [process.env.CLIENT_API], 
    credentials: true
  }
});
const corsOptions = {
  origin: [process.env.CLIENT_API],
  credentials: true
}

app.use(cors(corsOptions))
app.use(morgan(':method :url :status :response-time ms'));
app.use(helmet());
app.use(express.json());
app.use(cookieParser());


app.use("/api/user", userRouter)
app.use("/api/event", eventRouter);




io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);


  socket.on("newEvent", (eventData) => {
    console.log("New Event Created:", eventData);
    io.emit("eventUpdated", eventData); 
  });


  socket.on("attendeeJoined", (eventId) => {
    console.log(`Attendee joined event: ${eventId}`);
    io.emit("attendeeUpdate", eventId); 
  });


  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

app.listen(process.env.PORT, () => {
  console.log("Server running");
  connectToDb();
})