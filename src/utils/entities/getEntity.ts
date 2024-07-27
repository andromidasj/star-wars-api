import { db } from "@/db";
import { editedEntities } from "@/db/schema";
import { EntityType, SingleEntitySchemas } from "@/types";
import { and, eq } from "drizzle-orm";
import { z } from "zod";

export async function getEntity<
  T extends z.infer<(typeof SingleEntitySchemas)[number]>
>({
  swapiGetFn,
  entityType,
  entityId,
}: {
  swapiGetFn: (entityId: number) => Promise<T>;
  entityType: EntityType;
  entityId: number;
}) {
  try {
    // Get the entity from the SWAPI API
    const swapiResponsePromise = swapiGetFn(entityId);

    // Here I'm using DrizzleORM's select method, which you can see is modeled after SQL.
    // You can see the select method in the `updateEntity` function in `src/utils/updateEntity.ts`.
    // This just showcases the different ways to query the database using Drizzle ORM.
    const localResultsPromise = db
      .select()
      .from(editedEntities)
      .where(
        and(
          eq(editedEntities.entityType, entityType),
          eq(editedEntities.entityId, +entityId)
        )
      )
      .limit(1);

    const promiseArray = [swapiResponsePromise, localResultsPromise] as const;

    const [swapiResponse, localResults] = await Promise.all(promiseArray);

    const localEntity = localResults[0];

    // If the entity is not found in the database, return the data from the SWAPI API.
    if (!localEntity) {
      return Response.json(swapiResponse);
    }

    // Otherwise, merge the data from the database with the data from the SWAPI API and return that.
    const mergedData = {
      ...swapiResponse,
      ...(localResults[0]?.updatedData as Object),
    };
    return Response.json(mergedData);
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
