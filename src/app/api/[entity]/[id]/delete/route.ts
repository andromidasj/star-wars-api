import { db } from "@/db";
import { deletedEntities, entityTypesArr } from "@/db/schema";
import { DynamicIdParams, SwapiSchemas } from "@/types";
import { entityUrlToId } from "@/utils/entityUrlToId";
import { SWAPI } from "@/utils/SWAPI";
import { z } from "zod";

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

async function insertDeletedEntity<
  T extends z.infer<typeof SwapiSchemas.ANY_LIST>
>({
  swapiGetFn,
  entityType,
  entityId,
}: {
  swapiGetFn: () => Promise<T>;
  entityType: (typeof entityTypesArr)[number];
  entityId: string;
}) {
  const numberId = Number(entityId);
  if (isNaN(numberId)) {
    return Response.json(
      {
        error: {
          message: `Invalid ID: \`${entityId}\`. Please provide a valid ${entityType} ID, which should be a number.`,
        },
      },
      { status: 400 }
    );
  }
  try {
    const { results } = await swapiGetFn();
    if (!results.find((entity) => entityUrlToId(entity.url) === numberId)) {
      return Response.json(
        {
          error: {
            message: `Couldn't find any ${entityType} with ID ${numberId}`,
          },
        },
        { status: 404 }
      );
    }
    await db.insert(deletedEntities).values({ entityType, entityId: numberId });
    return Response.json({
      message: `Entity with ID ${numberId} has been deleted.`,
    });
  } catch (error) {
    // I could do some more conditional error handling here, but for now I'll just do a generic 500 error.
    // For example, if an entity already exists, it should probably return a 409 Conflict error or some other
    // appropriate error code.
    return Response.json({ error }, { status: 500 });
  }
}
