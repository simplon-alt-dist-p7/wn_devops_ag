import "reflect-metadata";
import { AppDataSource } from "./config/data-source.js";
import app from "./app.js";

async function start() {
  try {
    await AppDataSource.initialize();
    console.log("✅ Database connected with TypeORM.");

    const port = Number(process.env.SERVER_PORT ?? process.env.PORT ?? 3001);

    app.listen(port, () => {
      console.log(`🚀 Server is running on port ${port}`);
    });
  } catch (error) {
    console.error("❌ Database error:", error);
    process.exit(1);
  }
}

start();
