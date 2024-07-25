import { DynamicIdParams } from "../../types";
import { getEntityProperties } from "../../utils/getEntityProperties";
import { queryEntitiesById } from "../../utils/queryEntitiesById";
import { updateEntity } from "../../utils/updateEntity";

export async function GET(_request: Request, { params }: DynamicIdParams) {
  const entityProperties = getEntityProperties(params.entity);

  if (!entityProperties) {
    return Response.json(
      { error: { message: "Invalid path" } },
      { status: 400 }
    );
  }

  const { dbTable, entityName } = entityProperties;

  return await queryEntitiesById(dbTable, params.id, entityName);
}

export async function PUT(request: Request, { params }: DynamicIdParams) {
  const entityProperties = getEntityProperties(params.entity);

  if (!entityProperties) {
    return Response.json(
      { error: { message: "Invalid path" } },
      { status: 400 }
    );
  }

  const { dbTable, entityName, insertSchema } = entityProperties;

  return await updateEntity({
    request,
    id: params.id,
    table: dbTable,
    entityName,
    zodSchema: insertSchema,
  });
}
