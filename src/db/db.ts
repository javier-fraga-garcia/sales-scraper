import { Database } from "bun:sqlite";
import type { Storage } from "@/config/schema";

class ScrapeDb {
  private db: Database;
  private tableName: string;

  constructor(appName: string, storage: Storage) {
    this.db = new Database(`${appName}.sqlite`, { create: true });
    this.tableName = storage.table_name;

    const cols = [
      "id INTEGER PRIMARY KEY AUTOINCREMENT",
      ...storage.columns.map((c) => `${c} TEXT`),
    ].join(", ");

    this.db.run(`CREATE TABLE IF NOT EXISTS ${this.tableName} (${cols})`);
  }

  insert(row: Record<string, string>): void {
    const keys = Object.keys(row);
    const placeholders = keys.map(() => `?`).join(", ");
    const values = Object.values(row);

    this.db.run(
      `INSERT INTO ${this.tableName} (${keys.join(", ")}) VALUES (${placeholders})`,
      values,
    );
  }
}

export default ScrapeDb;
