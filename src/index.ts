import { parseArgs } from "util";
import { loadConfig } from "./config/config";
import LiteScraperDb from "./db/sqlite";
import Scraper from "./scraper/scraper";
import Cache from "./cache";
import { DeliveryFactory } from "./delivery";

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
  const cache = await Cache.create(config.app_name, "./");
  const scrapeDb = new LiteScraperDb(config.app_name, config.storage);
  const deliveryHandlers =
    config.delivery &&
    Object.values(config.delivery)
      .filter((d) => d.enabled)
      .map((d) => DeliveryFactory.create(d));
  const scraper = new Scraper(scrapeDb, cache, config.sites, deliveryHandlers);

  try {
    await scraper.scrape();
  } catch (e) {
    console.log(e);
    process.exit(1);
  } finally {
    scrapeDb.close();
  }
})();
