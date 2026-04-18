import Cache from "@/cache/cache";

(async () => {
  const cache = await Cache.create("sales-scraper", "./");
  await cache.setItem("test", { test: 1, b: 2 });
  await cache.setItem("test2", { test: 1, b: 2 });
  await cache.setItem("test3", { a: 1, b: 2 });
  console.log(await cache.loadItem("test2"));
  await cache.clear();
})();
