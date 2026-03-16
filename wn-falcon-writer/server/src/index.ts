import "reflect-metadata";
import { AppDataSource } from "./config/data-source.js";
import { checkDatabases } from "./checkDatabase.js";
import app from "./app.js";

async function start() {
  try {
    await AppDataSource.initialize();
    await checkDatabases();

    console.info("✅ Database connected with TypeORM.");

    const port = Number(process.env.WRITER_BACK_PORT);

    app.listen(port, () => {
      console.info(`🚀 Server is running on port ${port}`);
    });
  } catch (error) {
    console.error("❌ Database error:", error);
    process.exit(1);
  }
}

start();
