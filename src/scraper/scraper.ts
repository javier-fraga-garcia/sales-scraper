import type Cache from "@/cache";
import type { Site } from "@/config/schema";
import type ScraperDb from "@/db";
import type DeliveryService from "@/delivery";
import Parser from "./parser";

class Scraper {
  constructor(
    private db: ScraperDb,
    private cache: Cache,
    private sites: Site[],
    private deliveryService?: DeliveryService,
  ) {}

  async scrape(): Promise<void> {
    for (const site of this.sites) {
      for (const url of site.urls) {
        const cached = await this.cache.loadItem(url);
        if (cached) {
          const { row } = Parser.parse(cached, site);
          this.db.insert({ store: site.name, ...row });
          await this.notify(site, row);
          continue;
        }

        const html = await this.fetchUrl(url);
        if (!html) continue;

        const { row, fragment } = Parser.parse(html, site);

        this.db.insert({ store: site.name, ...row });
        await this.cache.setItem(url, fragment);
        await this.notify(site, row);
      }
    }
  }

  private async fetchUrl(url: string): Promise<string | null> {
    const res = await fetch(url);
    if (!res.ok) {
      console.error(
        `Imposible scrapear página ${url}. Código de estado: ${res.status}`,
      );
      return null;
    }
    return res.text();
  }

  private async notify(site: Site, row: Record<string, string>): Promise<void> {
    const notifyFields = Object.entries(site.columns)
      .filter(([name, config]) => config.notify && !!row[name])
      .map(([name]) => `${name}: ${row[name]}`);

    if (notifyFields.length === 0) return;

    await this.deliveryService?.send(
      `Oferta detectada en ${site.name}:\n${notifyFields.join("\n")}`,
    );
  }
}

export default Scraper;
