import { mkdir, stat, readdir, unlink } from "node:fs/promises";
import { resolve } from "node:path";
import { homedir } from "node:os";
import { createHash } from "node:crypto";

class CacheError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CacheError";
  }
}

export default class Cache {
  private _appName: string;
  private _baseDir: string;
  private _cacheDir: string;
  private _ttl: number;

  constructor(
    appName: string,
    cacheDir: string | null,
    obsolescence: number = 2,
  ) {
    this._appName = appName;
    this._baseDir = cacheDir ? resolve(cacheDir) : homedir();
    this._cacheDir = `${this._baseDir}/.cache/${this._appName}`;
    this._ttl = obsolescence * 24 * 60 * 60 * 1000;
  }

  get appName(): string {
    return this._appName;
  }

  get cacheDir(): string {
    return this._cacheDir;
  }

  get ttl(): number {
    return this._ttl;
  }

  static async create(
    appName: string,
    cacheDir: string | null,
    obsolescence: number = 2,
  ): Promise<Cache> {
    const instance = new Cache(appName, cacheDir, obsolescence);
    await mkdir(instance._cacheDir, { recursive: true });
    return instance;
  }

  async setItem(name: string, data: string): Promise<void> {
    try {
      const key = this.hashName(name);
      const filePath = this.getFilePath(key);
      await Bun.write(filePath, data);
    } catch (e) {
      throw new CacheError(`Error almacenando información en cache ${e}`);
    }
  }

  async loadItem(name: string): Promise<string | null> {
    const key = this.hashName(name);
    if (!(await this.exists(key))) return null;

    if (await this.isObsolete(key)) return null;

    try {
      return await Bun.file(this.getFilePath(key)).text();
    } catch (e) {
      throw new CacheError(`Error leyendo desde caché: ${e}`);
    }
  }

  async deleteItem(name: string): Promise<void> {
    const key = this.hashName(name);
    if (!(await this.exists(key)))
      throw new CacheError(`El archivo ${name} no existe en caché`);
    await Bun.file(this.getFilePath(key)).delete();
  }

  async clear(): Promise<void> {
    const files = await readdir(this._cacheDir);
    await Promise.all(files.map((f) => unlink(`${this._cacheDir}/${f}`)));
  }

  private getFilePath(key: string): string {
    return `${this._cacheDir}/${key}`;
  }

  private async exists(key: string): Promise<boolean> {
    return await Bun.file(this.getFilePath(key)).exists();
  }

  private async isObsolete(key: string): Promise<boolean> {
    try {
      const file = await stat(this.getFilePath(key));
      return Date.now() - file.mtimeMs > this._ttl;
    } catch (e) {
      return true;
    }
  }

  private hashName(name: string): string {
    return createHash("sha256").update(name).digest("hex");
  }
}
