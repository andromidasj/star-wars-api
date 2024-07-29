import { db } from "@/db";
import { editedEntities } from "@/db/schema";
import { EntityType, SingleEntitySchemas } from "@/types";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { updatedEntityIdToNinePaddedId } from "../entityIdUtils";

export async function createNewEntity<
  T extends z.infer<(typeof SingleEntitySchemas)[number]>
>({
  entityType,
  entityData,
}: {
  entityType: EntityType;
  entityData: Partial<T>;
}) {
  try {
    // Create a new entity in the database.
    const insertResult = await db
      .insert(editedEntities)
      .values({
        entityType,
        updatedData: entityData,
      })
      .returning({
        id: editedEntities.id,
        entityType: editedEntities.entityType,
        entityId: editedEntities.entityId,
        updatedData: editedEntities.updatedData,
      });

    if (!insertResult.length) {
      return Response.json({
        error: {
          message: `Couldn't create a new ${entityType}`,
        },
      });
    }

    const newlyCreatedEntityId = insertResult[0].id;

    // update the entityId in the database to include the "999" prefix.
    const updateResult = await db
      .update(editedEntities)
      .set({
        entityId: +updatedEntityIdToNinePaddedId(newlyCreatedEntityId),
      })
      .where(eq(editedEntities.id, newlyCreatedEntityId))
      .returning({
        entityType: editedEntities.entityType,
        entityId: editedEntities.entityId,
        updatedData: editedEntities.updatedData,
      });

    return Response.json(updateResult[0]);
  } catch (error) {}
}
