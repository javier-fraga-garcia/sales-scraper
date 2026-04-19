import { Database } from "bun:sqlite";
import type { Storage } from "@/config/schema";

export function createDb(appName: string, storage: Storage): Database {
  const db = new Database(`${appName}.sqlite`, { create: true });
  const cols = [
    "id INTEGER PRIMARY KEY AUTOINCREMENT",
    ...storage.columns.map((c) => `${c} TEXT`),
  ].join(", ");
  const query = `CREATE TABLE IF NOT EXISTS ${storage.table_name} (${cols})`;
  db.run(query);
  return db;
}
