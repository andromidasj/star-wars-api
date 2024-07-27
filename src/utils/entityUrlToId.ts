export function entityUrlToId(url: string) {
  return Number(url.split("/").at(-2));
}
