import { db } from "@/db";
import { editedEntities } from "@/db/schema";
import { EntityType, SingleEntitySchemas } from "@/types";
import { and, eq } from "drizzle-orm";
import { z } from "zod";

/**
 * This function is used to update an entity in the database. It takes in a function that fetches
 * the entity from the SWAPI API, and then merges the data from the API with the data from the database.
 * @param options
 */
export async function updateEntity<
  T extends z.infer<(typeof SingleEntitySchemas)[number]>
>({
  swapiGetFn,
  entityId,
  entityType,
  entityData,
}: {
  swapiGetFn: (entityId?: number) => Promise<T>;
  entityId: number;
  entityType: EntityType;
  entityData: Partial<T>;
}) {
  try {
    const isEntityIdLocal = !!(
      entityId && entityId.toString().startsWith("999")
    );

    // Get the entity from the SWAPI API (only if the entityId is not a local entity)
    let swapiResponsePromise;
    if (!isEntityIdLocal) {
      swapiResponsePromise = swapiGetFn(entityId);
    }

    const existingEntityResponsePromise = db.query.editedEntities.findFirst({
      where: and(
        eq(editedEntities.entityType, entityType),
        eq(editedEntities.entityId, entityId)
      ),
    });

    const [swapiResponse, existingEntityResponse] = await Promise.all([
      swapiResponsePromise,
      existingEntityResponsePromise,
    ]);

    // If the entity doesn't exist in the SWAPI API, return a 404 error.
    const entityNotFoundInSwapiResponse =
      swapiResponse &&
      "detail" in swapiResponse &&
      swapiResponse.detail === "Not found";

    if (entityNotFoundInSwapiResponse) {
      return Response.json(
        {
          error: {
            message: `Couldn't find any ${entityType} with ID ${entityId}`,
          },
        },
        { status: 404 }
      );
    }

    // If the customized entity doesn't exist in the database, insert it.
    if (!existingEntityResponse) {
      const insertResult = await db
        .insert(editedEntities)
        .values({
          entityId,
          entityType,
          updatedData: entityData,
        })
        .returning({
          id: editedEntities.id,
          entityType: editedEntities.entityType,
          entityId: editedEntities.entityId,
          updatedData: editedEntities.updatedData,
        });

      const mergedData = {
        ...swapiResponse,
        ...(insertResult[0].updatedData as Object),
      };
      return Response.json(mergedData);
    }

    // If the customized entity DOES exist in the database, update it,
    // and return the updated data.
    const updateResult = await db
      .update(editedEntities)
      .set({ updatedData: entityData, edited: new Date() })
      .where(
        and(
          eq(editedEntities.entityType, entityType),
          eq(editedEntities.entityId, entityId)
        )
      )
      .returning({
        id: editedEntities.id,
        entityType: editedEntities.entityType,
        entityId: editedEntities.entityId,
        updatedData: editedEntities.updatedData,
      });

    if (!updateResult.length) {
      return Response.json({
        error: {
          message: `Couldn't find any ${entityType} with ID ${entityId}`,
        },
      });
    }

    const mergedData2 = {
      ...swapiResponse,
      ...(updateResult[0].updatedData as Object),
    };
    return Response.json(mergedData2);
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
