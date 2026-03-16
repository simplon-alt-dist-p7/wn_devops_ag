import "reflect-metadata";
import { AppDataSource } from "./config/data-source.js";
import { startListener } from "./service/listener.js";
import { checkDatabases } from "./checkDatabase.js";
import app from "./app.js";

const port = Number(process.env.READER_BACK_PORT);

async function start() {
  try {
    await AppDataSource.initialize();
    await checkDatabases();
    console.info("✅ Connection has been established successfully (TypeORM).");

    startListener();
    console.info("👂ready to listen for event");
    app.listen(port, () => {
      console.info(`🚀 Server is running on port ${port}`);
    });
  } catch (error) {
    console.error("❌ Unable to connect to the database:", error);
    process.exit(1);
  }
}

start();
