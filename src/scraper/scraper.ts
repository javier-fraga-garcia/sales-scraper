import type Cache from "@/cache";
import type { Site } from "@/config/schema";
import type ScrapeDb from "@/db";
import type DeliveryService from "@/delivery";

interface ScraperDeps {
  db: ScrapeDb;
  cache: Cache;
  sites: Site[];
  deliveryService?: DeliveryService;
}

class Scraper {
  constructor(private deps: ScraperDeps) {}
}

export default Scraper;
