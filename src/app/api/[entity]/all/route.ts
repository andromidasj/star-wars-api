import { db } from "@/db";
import { DynamicIdParams } from "../../types";
import { getEntityProperties } from "../../utils/getEntityProperties";

export async function GET(_request: Request, { params }: DynamicIdParams) {
  const entityProperties = getEntityProperties(params.entity);

  if (!entityProperties) {
    return Response.json(
      { error: { message: "Invalid path" } },
      { status: 400 }
    );
  }

  const results = await db.select().from(entityProperties.dbTable);
  return Response.json({
    count: results.length,
    results,
  });
}
