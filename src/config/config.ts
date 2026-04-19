import { ConfigSchema, type Config } from "./schema";

export async function loadConfig(filePath: string): Promise<Config> {
  const file = Bun.file(filePath);
  if (!(await file.exists()))
    throw new Error(`Archivo no encontrado en ${filePath}`);

  const yamlContent = Bun.YAML.parse(await file.text());
  const result = ConfigSchema.safeParse(yamlContent);

  if (!result.success)
    throw new Error(`Cofiguracion no valida: ${result.error.toString()}`);

  return result.data;
}
