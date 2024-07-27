import { DynamicIdParams } from "@/types";
import { insertDeletedEntity } from "@/utils/insertDeletedEntity";
import { SWAPI } from "@/utils/SWAPI";

// I'm using a separate `/delete` endpoint to protect against accidental deletions.
// This way, it needs to be explicitly set in both the URL and the HTTP method.

export async function DELETE(_request: Request, { params }: DynamicIdParams) {
  switch (params.entity) {
    case "people": {
      return insertDeletedEntity({
        swapiGetFn: SWAPI.getPeople,
        entityType: "people",
        entityId: params.id,
      });
    }
    case "planets": {
      return insertDeletedEntity({
        swapiGetFn: SWAPI.getPlanets,
        entityType: "planets",
        entityId: params.id,
      });
    }
    case "starships": {
      return insertDeletedEntity({
        swapiGetFn: SWAPI.getStarships,
        entityType: "starships",
        entityId: params.id,
      });
    }
    case "vehicles": {
      return insertDeletedEntity({
        swapiGetFn: SWAPI.getVehicles,
        entityType: "vehicles",
        entityId: params.id,
      });
    }
    case "films": {
      return insertDeletedEntity({
        swapiGetFn: SWAPI.getFilms,
        entityType: "films",
        entityId: params.id,
      });
    }
    case "species": {
      return insertDeletedEntity({
        swapiGetFn: SWAPI.getSpecies,
        entityType: "species",
        entityId: params.id,
      });
    }
    default: {
      return Response.json(
        { error: { message: "Invalid path" } },
        { status: 400 }
      );
    }
  }
}
