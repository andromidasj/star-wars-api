import { DynamicIdParams } from "@/app/api/types";
import { deleteEntity } from "@/app/api/utils/deleteEntity";
import { getEntityProperties } from "@/app/api/utils/getEntityProperties";
import { characters } from "@/db/schema";

export async function DELETE(_request: Request, { params }: DynamicIdParams) {
  const entityProperties = getEntityProperties(params.entity);

  if (!entityProperties) {
    return Response.json(
      { error: { message: "Invalid path" } },
      { status: 400 }
    );
  }

  return deleteEntity({
    id: params.id,
    table: characters,
    entityName: "Character",
  });
}
