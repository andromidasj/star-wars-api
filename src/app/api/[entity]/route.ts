import { DynamicIdParams, EntityTypeEnumSchema } from "@/types";
import { createNewEntity } from "@/utils/entities/createNewEntity";
import { getAllEntities } from "@/utils/entities/getAllEntities";
import { SWAPI } from "@/utils/SWAPI";
import { NextRequest } from "next/server";
import { z } from "zod";

export async function GET(request: NextRequest, { params }: DynamicIdParams) {
  // Create a map of entity type to the function that fetches the entity from the SWAPI API.
  const entityMap = {
    people: SWAPI.getPeople,
    planets: SWAPI.getPlanets,
    starships: SWAPI.getStarships,
    vehicles: SWAPI.getVehicles,
    films: SWAPI.getFilms,
    species: SWAPI.getSpecies,
  } as const;

  // Extract the page number from the URL query parameters, and parse it as a number.
  // In this case, I'll just ignore the page number if it's not a valid number. The SWAPI API
  // instead returns a 404 error if the page number is invalid.
  const searchParams = request.nextUrl.searchParams;
  const { data: page } = z.coerce.number().safeParse(searchParams.get("page"));

  // Ensure that the entity type from the URL path is valid
  const parsedEntity = EntityTypeEnumSchema.safeParse(params.entity);
  if (!parsedEntity.success) {
    return Response.json(
      { error: { message: "Invalid path" } },
      { status: 400 }
    );
  }

  return getAllEntities({
    swapiGetFn: () => entityMap[parsedEntity.data](page),
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

  // Ensure that the entity type from the URL path is valid
  const parsedEntityType = EntityTypeEnumSchema.safeParse(params.entity);
  if (!parsedEntityType.success) {
    return Response.json(
      { error: { message: "Invalid path" } },
      { status: 400 }
    );
  }

  return createNewEntity({
    entityType: parsedEntityType.data,
    entityData,
  });
}
