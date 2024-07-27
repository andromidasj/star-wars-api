import { db } from "@/db";
import { editedEntities } from "@/db/schema";
import { DynamicIdParams } from "@/types";
import { getEntityProperties } from "@/utils/getEntityProperties";
import insertEntity from "@/utils/insertEntity";
import { mergeDataSets } from "@/utils/mergeDataSets";
import { SWAPI } from "@/utils/SWAPI";
import { eq } from "drizzle-orm";

export async function GET(_request: Request, { params }: DynamicIdParams) {
  switch (params.entity) {
    case "people": {
      try {
        const swapiResponse = await SWAPI.getPeople();
        const localResults = await db
          .select()
          .from(editedEntities)
          .where(eq(editedEntities.entityType, "people"));
        return Response.json(
          mergeDataSets({
            localResults,
            swapiResponse,
          })
        );
      } catch (error) {
        return Response.json({ error }, { status: 500 });
      }
    }
    case "planets": {
      try {
        const swapiResponse = await SWAPI.getPlanets();
        const localResults = await db
          .select()
          .from(editedEntities)
          .where(eq(editedEntities.entityType, "planets"));
        return Response.json(
          mergeDataSets({
            localResults,
            swapiResponse,
          })
        );
      } catch (error) {
        return Response.json({ error }, { status: 500 });
      }
    }
    case "starships": {
      try {
        const swapiResponse = await SWAPI.getStarships();
        const localResults = await db
          .select()
          .from(editedEntities)
          .where(eq(editedEntities.entityType, "starships"));
        return Response.json(
          mergeDataSets({
            localResults,
            swapiResponse,
          })
        );
      } catch (error) {
        return Response.json({ error }, { status: 500 });
      }
    }
    case "vehicles": {
      try {
        const swapiResponse = await SWAPI.getVehicles();
        const localResults = await db
          .select()
          .from(editedEntities)
          .where(eq(editedEntities.entityType, "vehicles"));
        return Response.json(
          mergeDataSets({
            localResults,
            swapiResponse,
          })
        );
      } catch (error) {
        return Response.json({ error }, { status: 500 });
      }
    }
    case "films": {
      try {
        const swapiResponse = await SWAPI.getFilms();
        const localResults = await db
          .select()
          .from(editedEntities)
          .where(eq(editedEntities.entityType, "films"));
        return Response.json(
          mergeDataSets({
            localResults,
            swapiResponse,
          })
        );
      } catch (error) {
        return Response.json({ error }, { status: 500 });
      }
    }
    case "species": {
      try {
        const swapiResponse = await SWAPI.getSpecies();
        const localResults = await db
          .select()
          .from(editedEntities)
          .where(eq(editedEntities.entityType, "species"));
        return Response.json(
          mergeDataSets({
            localResults,
            swapiResponse,
          })
        );
      } catch (error) {
        return Response.json({ error }, { status: 500 });
      }
    }
    default: {
      return Response.json(
        { error: { message: "Invalid path" } },
        { status: 400 }
      );
    }
  }
}

export async function POST(request: Request, { params }: DynamicIdParams) {
  const entityProperties = getEntityProperties(params.entity);

  if (!entityProperties) {
    return Response.json(
      { error: { message: "Invalid path" } },
      { status: 400 }
    );
  }

  const { dbTable, insertSchema } = entityProperties;

  return await insertEntity({
    request,
    table: dbTable,
    zodSchema: insertSchema,
  });
}
