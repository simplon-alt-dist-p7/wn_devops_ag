import express, { type Request, type Response } from "express";
import cors from "cors";
import articleRoute from "./route/articleRoute.js";
import categoryRoute from "./route/categoryRoute.js";
import commentRoute from "./route/commentRoute.js";
import favoriteRoute from "./route/favoriteRoute.js";

const app = express();

const allowedOrigins = [
  "http://localhost:8080",
  "http://localhost:8081",
  "https://wn-front-reader.onrender.com",
  "https://wn-front-writer.onrender.com",
];

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }),
);
app.use(express.json());

// Routes

app.use("/articles", articleRoute);
app.use("/favorite", favoriteRoute);
app.use("/categories", categoryRoute);
app.use("/", commentRoute);

app.get("/", (_req: Request, res: Response) => {
  res.json({ message: "API Express ready!" });
});

export default app;
