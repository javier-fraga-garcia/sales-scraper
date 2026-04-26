import type { Site } from "@/config/schema";
import * as cheerio from "cheerio";

class Parser {
  static parse(
    html: string,
    site: Site,
  ): { row: Record<string, string>; fragment: string } {
    const $ = cheerio.load(html);
    const row: Record<string, string> = {};

    for (const [name, config] of Object.entries(site.columns)) {
      const el = $(config.selector);
      row[name] = config.attribute
        ? (el.attr(config.attribute) ?? "")
        : el.text().trim().replace(/\s+/g, " ");
    }
    const fragment = $(site.cache_selector).toString();

    return { row, fragment };
  }
}

export default Parser;
