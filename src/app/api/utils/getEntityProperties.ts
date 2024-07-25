import {
  characters,
  insertCharacterSchema,
  insertPlanetSchema,
  insertShipSchema,
  planets,
  ships,
} from "@/db/schema";

export function getEntityProperties(entity: string) {
  switch (entity) {
    case "characters":
      return {
        insertSchema: insertCharacterSchema,
        entityName: "Character",
        dbTable: characters,
      };
    case "planets":
      return {
        insertSchema: insertPlanetSchema,
        entityName: "Planet",
        dbTable: planets,
      };
    case "ships":
      return {
        insertSchema: insertShipSchema,
        entityName: "Ship",
        dbTable: ships,
      };
    default:
      return null;
  }
}
