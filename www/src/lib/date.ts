/** Cached so `new Date()` doesn't break the static prerender (Cache Components). */
export async function getCurrentYear() {
  "use cache";
  return new Date().getFullYear();
}
