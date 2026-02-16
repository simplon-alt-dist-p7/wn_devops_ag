import "dotenv/config";
import "reflect-metadata";
import express from "express";
import { AppDataSource } from "./data-source.js";
import router from "../routes/router.js";
import cors from "cors";

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3000;

app.use(express.json());

// Routes
app.use("/articles", router);

// Initialisation TypeORM
app.get("/", (req, res) => {
  res.json({ message: "API is running" });
});

AppDataSource.initialize()
  .then(() => {
    console.log("📂 Database connected with TypeORM");
    app.listen(PORT, () => console.log(`🚀 Server on port ${PORT}`));
  })
  .catch((error) => console.log("❌ Database error:", error));
