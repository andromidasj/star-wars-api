import { db } from "@/db";
import { editedEntities, entityTypesArr } from "@/db/schema";
import { SingleEntitySchemas } from "@/types";
import { z } from "zod";

/**
 * This function is used to update an entity in the database. It takes in a function that fetches the entity from the SWAPI API, and then merges the data from the API with the data from the database.
 * @param options
 */
export async function updateEntity<
  T extends z.infer<(typeof SingleEntitySchemas)[number]>
>({
  swapiGetFn,
  entityType,
  entityId,
  entityData,
}: {
  swapiGetFn: (entityId: string) => Promise<T>;
  entityType: (typeof entityTypesArr)[number];
  entityId: string;
  entityData: Partial<T>;
}) {
  try {
    // Get the entity from the SWAPI API
    const swapiResponsePromise = swapiGetFn(entityId);

    // Here I'm using Drizzle ORM's insert method to insert the updated entity data into the database.
    // The `returning` method is used to return the updated entity data from the database.
    const insertionPromise = db
      .insert(editedEntities)
      .values({
        entityType,
        entityId: +entityId,
        updatedData: entityData,
      })
      .onConflictDoUpdate({
        target: editedEntities.entityId,
        set: {
          updatedData: entityData,
        },
      })
      .returning();

    const promiseArray = [swapiResponsePromise, insertionPromise] as const;

    const [swapiResponse, insertionResult] = await Promise.all(promiseArray);

    const mergedData = {
      ...swapiResponse,
      ...(insertionResult[0].updatedData as Object),
    };
    return Response.json(mergedData);
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
