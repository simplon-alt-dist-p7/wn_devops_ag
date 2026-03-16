import { AppDataSource } from "./config/data-source.js";

export async function checkDatabases() {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    const result = await AppDataSource.query(
      "SELECT datname FROM pg_database WHERE datname IN ('wn_db', 'wn_db_test');",
    );

    const existingDBs = result.map((row: { datname: string }) => row.datname);

    if (existingDBs.includes("wn_db") && existingDBs.includes("wn_db_test")) {
      console.info(
        "✅ DATABASE : 'wn_db' and 'wn_db_test' are correctly created.",
      );
    } else {
      console.warn("⚠️  WARNING : One of the databases is missing !");
      console.info("Found databases :", existingDBs.join(", "));
    }
  } catch (error) {
    console.error("❌ Error occurred while checking databases :", error);
  }
}
