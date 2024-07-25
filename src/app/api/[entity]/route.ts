import { DynamicIdParams } from "@/types";
import { getEntityProperties } from "@/utils/getEntityProperties";
import insertEntity from "@/utils/insertEntity";

export async function POST(request: Request, { params }: DynamicIdParams) {
  const entityProperties = getEntityProperties(params.entity);

  if (!entityProperties) {
    return Response.json(
      { error: { message: "Invalid path" } },
      { status: 400 }
    );
  }

  const { dbTable, insertSchema } = entityProperties;

  return await insertEntity({
    request,
    table: dbTable,
    zodSchema: insertSchema,
  });
}
