export function entityUrlToId(url: string) {
  return Number(url.split("/").at(-2));
}

export function updatedEntityIdToNinePaddedId(entityId: number) {
  return "999" + entityId;
}

export function removeNinePaddedId(entityId: number | string) {
  return Number(entityId.toString().substring(3));
}
