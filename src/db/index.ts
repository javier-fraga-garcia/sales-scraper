abstract class ScraperDb {
  abstract insert(row: Record<string, string>): void;
  abstract close(): void;
}

export type { ScraperDb };
export default ScraperDb;
