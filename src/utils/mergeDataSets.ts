import { editedEntities } from "@/db/schema";
import { SwapiSchemas } from "@/types";
import { InferSelectModel } from "drizzle-orm";
import { z } from "zod";

export function mergeDataSets<
  T extends InferSelectModel<typeof editedEntities>,
  U extends z.infer<typeof SwapiSchemas.ANY_LIST>
>({ localResults, swapiResponse }: { localResults: T[]; swapiResponse: U }) {
  const output = structuredClone(swapiResponse);
  const customEntityIdSet = new Set();
  for (const entity of localResults) {
    customEntityIdSet.add(entity.entityId);
  }
  output.results.forEach((entity, index) => {
    const entityId = Number(entity.url.split("/").at(-2));
    if (customEntityIdSet.has(entityId)) {
      const updatedData = localResults.find(
        (localEntity) => localEntity.entityId === entityId
      )?.updatedData as Object;

      output.results[index] = {
        ...entity,
        ...updatedData,
      };
    }
  });
  return output;
}
