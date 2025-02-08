import express from "express";
import connectToDb from "./db/db.js";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.routes.js";
import eventRouter from "./routes/event.routes.js";
dotenv.config({})
const app = express();
const corsOptions = {
  origin: ['http://localhost:5173'],
  credentials: true
}

app.use(cors(corsOptions))
app.use(morgan(':method :url :status :response-time ms'));
app.use(helmet());
app.use(express.json());
app.use(cookieParser());


app.use("/api/user", userRouter)
app.use("/api/event", eventRouter);


app.listen(process.env.PORT, () => {
  console.log("Server running");
  connectToDb();
})