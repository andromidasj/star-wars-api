export function entityUrlToId(url: string) {
  return Number(url.split("/").at(-2));
}

export function updatedEntityIdToNinePaddedId(entityId: number) {
  return "999" + entityId;
}
