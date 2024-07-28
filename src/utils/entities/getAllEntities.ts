import { db } from "@/db";
import { deletedEntities, editedEntities } from "@/db/schema";
import { EntityType, SwapiSchemas } from "@/types";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { entityUrlToId } from "../entityIdUtils";
import { mergeDataSets } from "../mergeDataSets";

export async function getAllEntities({
  swapiGetFn,
  entityType,
}: {
  swapiGetFn: () => Promise<z.infer<typeof SwapiSchemas.ANY_LIST>>;
  entityType: EntityType;
}) {
  try {
    const swapiResponsePromise = swapiGetFn();
    const localResultsPromise = db
      .select()
      .from(editedEntities)
      .where(eq(editedEntities.entityType, entityType));

    const deletedEntitiesPromise = db
      .select()
      .from(deletedEntities)
      .where(eq(deletedEntities.entityType, entityType));

    const promiseArray = [
      swapiResponsePromise,
      localResultsPromise,
      deletedEntitiesPromise,
    ] as const;

    // Use Promise.all to process all promises in parallel
    const [swapiResponse, localResults, deletedEntitiesResults] =
      await Promise.all(promiseArray);

    // Filter out deleted entities from the SWAPI API response
    const deletedEntitiesIds = new Set(
      deletedEntitiesResults.map(({ entityId }) => entityId)
    );
    const filteredSwapiResponse = swapiResponse.results.filter(
      (entity) => !deletedEntitiesIds.has(entityUrlToId(entity.url))
    );
    swapiResponse.results = filteredSwapiResponse;

    // Merge the data from the local database with the data from the SWAPI API
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
