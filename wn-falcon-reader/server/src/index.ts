import "reflect-metadata";
import express, { type Request, type Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { AppDataSource } from "./config/data-source.js";
import articleRoute from "./route/articleRoute.js";
import categoryRoute from "./route/categoryRoute.js";
import commentRoute from "./route/commentRoute.js";
import { startListener } from "./service/listener.js";
import favoriteRoute from "./route/favoriteRoute.js";

dotenv.config();

const app = express();
const port = Number(process.env.SERVER_PORT ?? 3001);

app.use(cors());
app.use(express.json());

// Routes
//GET all articles
app.use("/articles", articleRoute);
app.use("/favorite", favoriteRoute);
//GET all categories
app.use("/categories", categoryRoute);

//GET all comments
app.use("/", commentRoute);

app.get("/", (_req: Request, res: Response) => {
  res.json({ message: "API Express ready!" });
});

async function start() {
  try {
    await AppDataSource.initialize();
    console.log("✅ Connection has been established successfully (TypeORM).");

    startListener();
    console.log("👂ready to listen for event");
    app.listen(port, () => {
      console.log(`🚀 Server is running on port ${port}`);
    });
  } catch (error) {
    console.error("❌ Unable to connect to the database:", error);
    process.exit(1);
  }
}

start();
