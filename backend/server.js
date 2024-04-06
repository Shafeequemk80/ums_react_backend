import dotenv from "dotenv";
import express from "express";
import path from 'path'
import { fileURLToPath } from 'url';
dotenv.config();
const PORT = process.env.PORT || 5000;
import userRoutes from "./routes/userRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import cookieParser from "cookie-parser";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import connectDB from "./config/db.js";
import cors from 'cors'
const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.use(cors())
app.use("/static", express.static(path.join(__dirname, "./public")));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())
connectDB();
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use(errorHandler);
app.use(notFound);

app.get("/", (req, res) => {
  res.send("Server Ready");
});

app.listen(PORT, () => console.log(`Server Started on port ${PORT}`));
