import { db } from "@/db";
import { editedEntities } from "@/db/schema";
import { EntityType, SwapiSchemas } from "@/types";
import { eq } from "drizzle-orm";
import { z } from "zod";
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

    const promiseArray = [swapiResponsePromise, localResultsPromise] as const;

    const [swapiResponse, localResults] = await Promise.all(promiseArray);

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
