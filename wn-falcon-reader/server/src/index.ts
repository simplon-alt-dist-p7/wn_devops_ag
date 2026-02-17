import "reflect-metadata";
import { AppDataSource } from "./config/data-source.js";
import { startListener } from "./service/listener.js";
import app from "./app.js";

const port = Number(process.env.SERVER_PORT ?? 3001);

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
