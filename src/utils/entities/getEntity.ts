import { db } from "@/db";
import { deletedEntities, editedEntities } from "@/db/schema";
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
    const editedEntitiesPromise = db
      .select()
      .from(editedEntities)
      .where(
        and(
          eq(editedEntities.entityType, entityType),
          eq(editedEntities.entityId, +entityId)
        )
      )
      .limit(1);

    // Here, I'm using the query builder from DrizzleORM. It's a bit more concise, and does the
    // same thing as above while being a bit more readable.
    const deletedEntitiesPromise = db.query.deletedEntities.findFirst({
      where: and(
        eq(deletedEntities.entityType, entityType),
        eq(deletedEntities.entityId, +entityId)
      ),
    });

    const promiseArray = [
      swapiResponsePromise,
      editedEntitiesPromise,
      deletedEntitiesPromise,
    ] as const;

    const [swapiResponse, editedResults, deletedResult] = await Promise.all(
      promiseArray
    );

    // Filter out deleted entities from the SWAPI API response
    if (deletedResult) {
      return Response.json(
        {
          error: {
            message: `Couldn't find any ${entityType} with ID ${entityId}`,
          },
        },
        { status: 404 }
      );
    }

    const localEntity = editedResults[0];

    // If the entity is not found in the database, return the data from the SWAPI API.
    if (!localEntity) {
      return Response.json(swapiResponse);
    }

    // Otherwise, merge the data from the database with the data from the SWAPI API and return that.
    const mergedData = {
      ...swapiResponse,
      ...(editedResults[0]?.updatedData as Object),
    };
    return Response.json(mergedData);
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
