import { DynamicIdParams, EntityTypeEnumSchema } from "@/types";
import { getAllEntities } from "@/utils/entities/getAllEntities";
import { upsertEntity } from "@/utils/entities/upsertEntity";
import { SWAPI } from "@/utils/SWAPI";

export async function GET(_request: Request, { params }: DynamicIdParams) {
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

  return getAllEntities({
    swapiGetFn: entityMap[parsedEntity.data],
    entityType: parsedEntity.data,
  });
}

export async function POST(request: Request, { params }: DynamicIdParams) {
  // Parse the request body as JSON.
  let entityData;
  try {
    entityData = await request.json();
  } catch (error) {
    return Response.json(
      { error: { message: "Invalid request body" } },
      { status: 400 }
    );
  }

  // Create a map of entity type to the function that fetches the entity from the SWAPI API.
  const entityMap = {
    people: SWAPI.getPersonById,
    planets: SWAPI.getPlanetById,
    starships: SWAPI.getStarshipById,
    vehicles: SWAPI.getVehicleById,
    films: SWAPI.getFilmById,
    species: SWAPI.getSpeciesById,
  } as const;

  const parsedEntity = EntityTypeEnumSchema.safeParse(params.entity);
  if (!parsedEntity.success) {
    return Response.json(
      { error: { message: "Invalid path" } },
      { status: 400 }
    );
  }

  return upsertEntity({
    swapiGetFn: entityMap[parsedEntity.data] as (id: number) => Promise<any>,
    entityType: parsedEntity.data,
    entityId: +params.id,
    entityData,
  });
}
