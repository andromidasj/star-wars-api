import { db } from "@/db";
import { editedEntities } from "@/db/schema";
import { DynamicIdParams, EntityTypeEnumSchema } from "@/types";
import { insertDeletedEntity } from "@/utils/entities/insertDeletedEntity";
import { removeNinePaddedId } from "@/utils/entityIdUtils";
import { SWAPI } from "@/utils/SWAPI";
import { eq } from "drizzle-orm";

// I'm using a separate `/delete` endpoint to protect against accidental deletions.
// This way, it needs to be explicitly set in both the URL and the HTTP method.

export async function DELETE(_request: Request, { params }: DynamicIdParams) {
  const isEntityLocal = params.id.startsWith("999");

  if (isEntityLocal) {
    try {
      // If the entityId is a local entity, delete it from the database.
      await db
        .delete(editedEntities)
        .where(eq(editedEntities.id, removeNinePaddedId(params.id)));
      return Response.json({
        message: `Entity with ID ${params.id} has been deleted.`,
      });
    } catch (error) {
      return Response.json({ error }, { status: 500 });
    }
  }

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
