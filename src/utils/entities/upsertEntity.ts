import { db } from "@/db";
import { editedEntities } from "@/db/schema";
import { EntityType, SingleEntitySchemas } from "@/types";
import { eq } from "drizzle-orm";
import { z } from "zod";
import {
  removeNinePaddedId,
  updatedEntityIdToNinePaddedId,
} from "../entityIdUtils";

/**
 * This function is used to update an entity in the database. It takes in a function that fetches
 * the entity from the SWAPI API, and then merges the data from the API with the data from the database.
 * @param options
 */
export async function upsertEntity<
  T extends z.infer<(typeof SingleEntitySchemas)[number]>
>({
  swapiGetFn,
  entityId,
  entityType,
  entityData,
}: {
  swapiGetFn: (entityId?: number) => Promise<T>;
  entityId?: number;
  entityType: EntityType;
  entityData: Partial<T>;
}) {
  try {
    const isEntityLocal = !!(entityId && entityId.toString().startsWith("999"));
    const entityIdToUse = isEntityLocal
      ? Number(entityId.toString().substring(3))
      : entityId;

    // Get the entity from the SWAPI API (only if the entityId is provided)
    let swapiResponsePromise;
    if (entityId && !isEntityLocal) {
      swapiResponsePromise = swapiGetFn(entityId);
    }

    let insertionPromise;
    if (isEntityLocal) {
      // If the entityId is a local entity, update the entity data in the database.
      insertionPromise = db
        .update(editedEntities)
        .set({ updatedData: entityData })
        .where(eq(editedEntities.id, entityIdToUse!))
        .returning({
          id: editedEntities.id,
          entityType: editedEntities.entityType,
          entityId: editedEntities.entityId,
          updatedData: editedEntities.updatedData,
        });
    } else {
      // Here I'm using Drizzle ORM's insert method to insert the updated entity data into the database.
      // The `onConflictDoUpdate` method is used to update the entity data if it already exists in the database,
      // effectively upserting the entity. The `returning` method is used to return the updated entity data from
      // the database.
      insertionPromise = db
        .insert(editedEntities)
        .values({
          entityId: isEntityLocal
            ? removeNinePaddedId(entityIdToUse!)
            : entityId,
          entityType,
          updatedData: entityData,
        })
        .onConflictDoUpdate({
          target: editedEntities.entityId,
          set: { updatedData: entityData },
        })
        .returning({
          id: editedEntities.id,
          entityType: editedEntities.entityType,
          entityId: editedEntities.entityId,
          updatedData: editedEntities.updatedData,
        });
    }

    // Use Promise.all to process both promises in parallel
    const promiseArray = [swapiResponsePromise, insertionPromise] as const;
    const [swapiResponse, insertionResult] = await Promise.all(promiseArray);
    console.log("🚀 ~ insertionResult:", insertionResult);

    if (entityId) {
      // If the entityId is provided, merge the data from the SWAPI API with the data from the database.
      const mergedData = {
        ...swapiResponse,
        ...(insertionResult[0].updatedData as Object),
      };
      return Response.json(mergedData);
    }

    // If the entityId is not provided, return the data from the database.
    const obj = insertionResult[0];
    return Response.json({
      entityType: obj.entityType,
      // If the entityId is a local entity, pad the ID with "999"
      // to separate it from the SWAPI API's IDs. Works fine for this
      // limited dataset.
      entityId: updatedEntityIdToNinePaddedId(obj.id),
      data: obj.updatedData,
    });
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
