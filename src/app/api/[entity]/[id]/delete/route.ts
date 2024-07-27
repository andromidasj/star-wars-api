import { DynamicIdParams, EntityTypeEnumSchema } from "@/types";
import { insertDeletedEntity } from "@/utils/entities/insertDeletedEntity";
import { SWAPI } from "@/utils/SWAPI";

// I'm using a separate `/delete` endpoint to protect against accidental deletions.
// This way, it needs to be explicitly set in both the URL and the HTTP method.

export async function DELETE(_request: Request, { params }: DynamicIdParams) {
  // Create a map of entity type to the function that fetches the entity from the SWAPI API.
  const entityMap = {
    people: SWAPI.getPeople,
    planets: SWAPI.getPlanets,
    starships: SWAPI.getStarships,
    vehicles: SWAPI.getVehicles,
    films: SWAPI.getFilms,
    species: SWAPI.getSpecies,
  } as const;

  const parsedEntity = EntityTypeEnumSchema.safeParse(params.entity);
  if (!parsedEntity.success) {
    return Response.json(
      { error: { message: "Invalid path" } },
      { status: 400 }
    );
  }

  return insertDeletedEntity({
    swapiGetFn: entityMap[parsedEntity.data] as () => Promise<any>,
    entityType: parsedEntity.data,
    entityId: +params.id,
  });
}
