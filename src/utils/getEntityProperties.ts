import {
  characters,
  insertCharacterSchema,
  insertPlanetSchema,
  insertShipSchema,
  planets,
  ships,
} from "@/db/schema";
import { SwapiSchemas } from "@/types";
import { SWAPI } from "./SWAPI";

export function getEntityProperties(entity: string) {
  switch (entity) {
    case "people":
      return {
        swapiSchema: SwapiSchemas.People,
        swapiFetchFn: SWAPI.getCharacters,
        insertSchema: insertCharacterSchema,
        entityName: "Character",
        dbTable: characters,
      };
    case "planets":
      return {
        swapiSchema: SwapiSchemas.Planet,
        // swapiFetchFn: SWAPI.getPlanets,
        insertSchema: insertPlanetSchema,
        entityName: "Planet",
        dbTable: planets,
      };
    case "starships":
      return {
        swapiSchema: SwapiSchemas.Starship,
        insertSchema: insertShipSchema,
        entityName: "Ship",
        dbTable: ships,
      };
    default:
      return null;
  }
}
