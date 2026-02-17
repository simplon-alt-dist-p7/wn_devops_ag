import express, { type Request, type Response } from "express";
import cors from "cors";
import articleRoute from "./route/articleRoute.js";
import categoryRoute from "./route/categoryRoute.js";
import commentRoute from "./route/commentRoute.js";
import favoriteRoute from "./route/favoriteRoute.js";

const app = express();

app.use(cors());
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
