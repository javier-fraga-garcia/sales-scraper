import { parseArgs } from "util";
import { loadConfig } from "./config/config";

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

  console.log(config.sites[0]?.urls);
})();
