import type Cache from "@/cache";
import type { Site } from "@/config/schema";
import type ScraperDb from "@/db";
import type DeliveryService from "@/delivery";

interface ScraperDeps {
  db: ScraperDb;
  cache: Cache;
  sites: Site[];
  deliveryService?: DeliveryService;
}

class Scraper {
  constructor(private deps: ScraperDeps) {}
}

export default Scraper;
