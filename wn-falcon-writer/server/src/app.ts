import express, { type Request, type Response } from "express";
import cors from "cors";
import articleRoute from "./route/articleRoute.js";
import categoryRoute from "./route/categoryRoute.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/articles", articleRoute);
app.use("/categories", categoryRoute);

app.get("/", (_req: Request, res: Response) => {
  res.json({ message: "API Express ready!" });
});

export default app;
