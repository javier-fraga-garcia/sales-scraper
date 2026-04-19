import { parseArgs } from "util";
import { loadConfig } from "./config/config";
import ScrapeDb from "./db/db";

(async () => {
  const { values } = parseArgs({
    args: Bun.argv.slice(2),
    options: {
      config: {
        type: "string",
        short: "c",
      },
    },
  });

  const configPath = values.config;

  if (!configPath) {
    console.error(
      "[x] Error: Debes indicar un archivo de configuración con -c o --config",
    );
    process.exit(1);
  }

  const config = await loadConfig(configPath);
  const scrapeDb = new ScrapeDb(config.app_name, config.storage);
  const exampleRow = {
    title: "test",
    price: "12.3€",
    image_url: "https://image.com",
    availability: "true",
  };
  scrapeDb.insert(exampleRow);
})();
