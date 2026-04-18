import Cache from "@/cache/cache";

(async () => {
  const cache = await Cache.create("sales-scraper", "./");
  await cache.setItem("test", JSON.stringify({ test: 1, b: 2 }));
  await cache.setItem("test2", "texto de pruebas");
  console.log(await cache.loadItem("test2"));
  console.log(await cache.loadItem("test"));
  await cache.clear();
})();
