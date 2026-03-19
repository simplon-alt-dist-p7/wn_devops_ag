import express, { type Request, type Response } from "express";
import cors from "cors";
import articleRoute from "./route/articleRoute.js";
import categoryRoute from "./route/categoryRoute.js";

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

app.use("/articles", articleRoute);
app.use("/categories", categoryRoute);

app.get("/", (_req: Request, res: Response) => {
  res.json({ message: "API Express ready!" });
});

export default app;
