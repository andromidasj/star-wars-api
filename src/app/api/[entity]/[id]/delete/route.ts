import { characters } from "@/db/schema";
import { DynamicIdParams } from "@/types";
import { deleteEntity } from "@/utils/deleteEntity";
import { getEntityProperties } from "@/utils/getEntityProperties";

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
