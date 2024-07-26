import {
  films,
  insertFilmsSchema,
  insertPeopleSchema,
  insertPlanetSchema,
  insertSpeciesSchema,
  insertStarshipsSchema,
  insertVehiclesSchema,
  people,
  planets,
  species,
  starships,
  vehicles,
} from "@/db/schema";
import { SwapiSchemas } from "@/types";
import { SWAPI } from "./SWAPI";

export function getEntityProperties(entity: string) {
  switch (entity) {
    case "people":
      return {
        swapiSchema: SwapiSchemas.People,
        swapiFetchFn: SWAPI.getPeople,
        insertSchema: insertPeopleSchema,
        entityName: "Person",
        dbTable: people,
      };
    case "planets":
      return {
        swapiSchema: SwapiSchemas.Planet,
        swapiFetchFn: SWAPI.getPlanets,
        insertSchema: insertPlanetSchema,
        entityName: "Planet",
        dbTable: planets,
      };
    case "starships":
      return {
        swapiSchema: SwapiSchemas.Starship,
        swapiFetchFn: SWAPI.getStarships,
        insertSchema: insertStarshipsSchema,
        entityName: "Starship",
        dbTable: starships,
      };
    case "vehicles":
      return {
        swapiSchema: SwapiSchemas.Vehicle,
        swapiFetchFn: SWAPI.getVehicles,
        insertSchema: insertVehiclesSchema,
        entityName: "Vehicle",
        dbTable: vehicles,
      };
    case "films":
      return {
        swapiSchema: SwapiSchemas.Film,
        swapiFetchFn: SWAPI.getFilms,
        insertSchema: insertFilmsSchema,
        entityName: "Film",
        dbTable: films,
      };
    case "species":
      return {
        swapiSchema: SwapiSchemas.Species,
        swapiFetchFn: SWAPI.getSpecies,
        insertSchema: insertSpeciesSchema,
        entityName: "Species",
        dbTable: species,
      };
    default:
      return null;
  }
}
