import { db } from "@/db";
import { deletedEntities } from "@/db/schema";
import { EntityType, SwapiSchemas } from "@/types";
import { z } from "zod";
import { entityUrlToId } from "../entityIdUtils";

export async function insertDeletedEntity<
  T extends z.infer<typeof SwapiSchemas.ANY_LIST>
>({
  swapiGetFn,
  entityType,
  entityId,
}: {
  swapiGetFn: () => Promise<T>;
  entityType: EntityType;
  entityId: number;
}) {
  const numberId = Number(entityId);
  if (isNaN(numberId)) {
    return Response.json(
      {
        error: {
          message: `Invalid ID: \`${entityId}\`. Please provide a valid ${entityType} ID, which should be a number.`,
        },
      },
      { status: 400 }
    );
  }
  try {
    const { results } = await swapiGetFn();
    if (!results.find((entity) => entityUrlToId(entity.url) === numberId)) {
      return Response.json(
        {
          error: {
            message: `Couldn't find any ${entityType} with ID ${numberId}`,
          },
        },
        { status: 404 }
      );
    }
    await db.insert(deletedEntities).values({ entityType, entityId: numberId });
    return Response.json({
      message: `Entity with ID ${numberId} has been deleted.`,
    });
  } catch (error) {
    // I could do some more conditional error handling here, but for now I'll just do a generic 500 error.
    // For example, if an entity already exists, it should probably return a 409 Conflict error or some other
    // appropriate error code.
    return Response.json({ error }, { status: 500 });
  }
}
