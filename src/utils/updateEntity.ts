import { db } from "@/db";
import { editedEntities, entityTypesArr } from "@/db/schema";
import { SingleEntitySchemas } from "@/types";
import { and, eq } from "drizzle-orm";
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
}: {
  swapiGetFn: (entityId: string) => Promise<T>;
  entityType: (typeof entityTypesArr)[number];
  entityId: string;
}) {
  try {
    // Get the entity from the SWAPI API
    const swapiResponse = await swapiGetFn(entityId);

    // Here I'm using the ORM's query method instead of a select method. You can see the
    // select method in the `getEntity` function in `src/utils/getEntity.ts`. This just
    // showcases the different ways to query the database using Drizzle ORM, and their query
    // methods are a bit more concise and easier to read in my opinion.
    const localResults = await db.query.editedEntities.findFirst({
      where: and(
        eq(editedEntities.entityType, entityType),
        eq(editedEntities.entityId, +entityId)
      ),
    });

    if (!localResults) {
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
      ...(localResults?.updatedData as Object),
    };
    return Response.json(mergedData);
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
