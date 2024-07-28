import { editedEntities } from "@/db/schema";
import { SwapiSchemas } from "@/types";
import { InferSelectModel } from "drizzle-orm";
import { z } from "zod";
import { updatedEntityIdToNinePaddedId } from "./entityIdUtils";

/**
 * This function merges the data from the local database with the data from the SWAPI API.
 * If an entity ID is found in the local database, it will be merged with the data from the SWAPI API.
 * If an entity ID in the local database is not found in the SWAPI API, it will be appended to the output.
 * @param config
 */
export function mergeDataSets<
  T extends InferSelectModel<typeof editedEntities>,
  U extends z.infer<typeof SwapiSchemas.ANY_LIST>
>({ localResults, swapiResponse }: { localResults: T[]; swapiResponse: U }) {
  const output = structuredClone(swapiResponse);

  const addedEntitiesArr = [];

  // Create a set of entity IDs from the local database
  const customEntityIdSet = new Set();
  for (const entity of localResults) {
    if (entity.entityId) {
      customEntityIdSet.add(entity.entityId);
    } else {
      addedEntitiesArr.push(entity);
    }
  }

  // Iterate through the results from the SWAPI API and merge the data from the local database
  // if the entity ID matches.
  output.results.forEach((entity, index) => {
    const entityId = Number(entity.url.split("/").at(-2));
    if (!entityId) {
      return;
    }
    if (customEntityIdSet.has(entityId)) {
      // This could be optimized by storing the index on the first iteration and then using it
      // on subsequent iterations instead of searching for the entity ID in the localResults array.
      const updatedData = localResults.find(
        (localEntity) => localEntity.entityId === entityId
      )?.updatedData as Object;

      output.results[index] = {
        ...entity,
        ...updatedData,
      };
      customEntityIdSet.delete(entityId);
    }
  });

  // Append the results from the local database that don't have an entity ID in the SWAPI API
  // to the output.
  const localResultsWithoutEntityIdWithUrl = addedEntitiesArr.map((entity) => ({
    ...(entity.updatedData as Object),
    id: updatedEntityIdToNinePaddedId(entity.id),
    url: "",
    created: entity.created?.toString() ?? Date.now().toString(),
    edited: Date.now().toString(),
  }));
  output.results.push(...localResultsWithoutEntityIdWithUrl);

  // Update the count of the output to include the local results
  output.count += localResultsWithoutEntityIdWithUrl.length;

  return output;
}
