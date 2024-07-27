import { getEntity } from "@/utils/getEntity";
import { getEntityProperties } from "@/utils/getEntityProperties";
import { SWAPI } from "@/utils/SWAPI";
import { updateEntity } from "@/utils/updateEntity";
import { DynamicIdParams } from "../../../../types";

export async function GET(_request: Request, { params }: DynamicIdParams) {
  switch (params.entity) {
    case "people": {
      return getEntity({
        swapiGetFn: SWAPI.getPersonById,
        entityType: "people",
        entityId: params.id,
      });
    }
    case "planets": {
      return getEntity({
        swapiGetFn: SWAPI.getPlanetById,
        entityType: "planets",
        entityId: params.id,
      });
    }
    case "starships": {
      return getEntity({
        swapiGetFn: SWAPI.getStarshipById,
        entityType: "starships",
        entityId: params.id,
      });
    }
    case "vehicles": {
      return getEntity({
        swapiGetFn: SWAPI.getVehicleById,
        entityType: "vehicles",
        entityId: params.id,
      });
    }
    case "films": {
      return getEntity({
        swapiGetFn: SWAPI.getFilmById,
        entityType: "films",
        entityId: params.id,
      });
    }
    case "species": {
      return getEntity({
        swapiGetFn: SWAPI.getSpeciesById,
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

export async function PUT(request: Request, { params }: DynamicIdParams) {
  const entityProperties = getEntityProperties(params.entity);

  if (!entityProperties) {
    return Response.json(
      { error: { message: "Invalid path" } },
      { status: 400 }
    );
  }

  const { dbTable, entityName, insertSchema } = entityProperties;

  return await updateEntity({
    request,
    id: params.id,
    table: dbTable,
    entityName,
    zodSchema: insertSchema,
  });
}
