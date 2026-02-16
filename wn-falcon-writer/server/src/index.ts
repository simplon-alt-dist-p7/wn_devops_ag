import "reflect-metadata";
import "dotenv/config";

import express, { type Request, type Response } from "express";
import cors from "cors";
import articleRoute from "./route/articleRoute.js";
import categoryRoute from "./route/categoryRoute.js"
import { AppDataSource } from "./config/data-source.js";

const app = express();
const port = Number(process.env.SERVER_PORT ?? process.env.PORT ?? 3001);

app.use(cors());
app.use(express.json());

// Routes
app.use("/articles", articleRoute);
app.use("/categories", categoryRoute);

app.get("/", (_req: Request, res: Response) => {
    res.json({ message: "API Express ready!" });
});

async function start() {
    try {
        await AppDataSource.initialize();
        console.log("✅ Database connected with TypeORM.");

        app.listen(port, () => {
            console.log(`🚀 Server is running on port ${port}`);
        });
    } catch (error) {
        console.error("❌ Database error:", error);
        process.exit(1);
    }
}

start();
