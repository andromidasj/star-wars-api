import { getEntity } from "@/utils/getEntity";
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
  let entityData;
  try {
    entityData = await request.json();
  } catch (error) {
    return Response.json(
      { error: { message: "Invalid request body" } },
      { status: 400 }
    );
  }
  switch (params.entity) {
    case "people": {
      return updateEntity({
        swapiGetFn: SWAPI.getPersonById,
        entityType: "people",
        entityId: params.id,
        entityData,
      });
    }
    case "planets": {
      return updateEntity({
        swapiGetFn: SWAPI.getPlanetById,
        entityType: "planets",
        entityId: params.id,
        entityData,
      });
    }
    case "starships": {
      return updateEntity({
        swapiGetFn: SWAPI.getStarshipById,
        entityType: "starships",
        entityId: params.id,
        entityData,
      });
    }
    case "vehicles": {
      return updateEntity({
        swapiGetFn: SWAPI.getVehicleById,
        entityType: "vehicles",
        entityId: params.id,
        entityData,
      });
    }
    case "films": {
      return updateEntity({
        swapiGetFn: SWAPI.getFilmById,
        entityType: "films",
        entityId: params.id,
        entityData,
      });
    }
    case "species": {
      return updateEntity({
        swapiGetFn: SWAPI.getSpeciesById,
        entityType: "species",
        entityId: params.id,
        entityData,
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
