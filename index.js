import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import path from "path";
import colors from "colors";
import cors from "cors";
import connectdb from "./config/db.js";
import UserRoutes from "./routes/userRoutes.js";
import http from "http";
const server = http.createServer();
import { Server } from "socket.io";
const io = new Server(server);
dotenv.config();

connectdb();

const app = express();

app.use(cors());
if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
  }
app.use(express.json());
app.use("/api/users", UserRoutes);
io.on("connection", (socket) => {
  socket.on("private message", ({ content, to }) => {
    socket.to(to).emit("private message", {
      content,
      from: socket.id,
    });
  });
})

app.get("/", (req, res) => res.status(200).send("Api is running..."));
const PORT = process.env.PORT || 5000;
app.listen(
  PORT,
  console.log(
    `Server is running in ${process.env.NODE_ENV} on Port ${PORT}`.yellow
      .underline.bold
  )
);
