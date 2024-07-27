import { db } from "@/db";
import { editedEntities, entityTypesArr } from "@/db/schema";
import { SingleEntitySchemas } from "@/types";
import { and, eq } from "drizzle-orm";
import { z } from "zod";

export async function getEntity<
  T extends z.infer<(typeof SingleEntitySchemas)[number]>
>({
  swapiGetFn,
  entityType,
  entityId,
}: {
  swapiGetFn: (entityId: string) => Promise<T>;
  entityType: (typeof entityTypesArr)[number];
  entityId: string;
}) {
  try {
    // Get the entity from the SWAPI API
    const swapiResponse = await swapiGetFn(entityId);

    // Here I'm using DrizzleORM's select method, which you can see is modeled after SQL.
    // You can see the select method in the `updateEntity` function in `src/utils/updateEntity.ts`.
    // This just showcases the different ways to query the database using Drizzle ORM.
    const localResults = await db
      .select()
      .from(editedEntities)
      .where(
        and(
          eq(editedEntities.entityType, entityType),
          eq(editedEntities.entityId, +entityId)
        )
      )
      .limit(1);

    const localEntity = localResults[0];
    if (!localEntity) {
      return Response.json(
        {
          error: {
            message: `Couldn't find any ${entityType} with ID ${entityId}`,
          },
        },
        { status: 404 }
      );
    }

    const mergedData = {
      ...swapiResponse,
      ...(localResults[0]?.updatedData as Object),
    };
    return Response.json(mergedData);
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
