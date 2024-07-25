import { db } from "@/db";
import { eq } from "drizzle-orm";
import { PgTableWithColumns } from "drizzle-orm/pg-core";
import { z } from "zod";

type UpdateEntityOptions<
  T extends PgTableWithColumns<any>,
  S extends z.ZodObject<any>
> = {
  request: Request;
  id: string;
  table: T;
  entityName: string;
  zodSchema: S;
};

export async function updateEntity<
  T extends PgTableWithColumns<any>,
  S extends z.ZodObject<any>
>({
  request,
  id: rawId,
  table,
  entityName,
  zodSchema,
}: UpdateEntityOptions<T, S>): Promise<Response> {
  // Parse and validate the ID
  const parsedId = Number(rawId);
  if (isNaN(parsedId)) {
    return Response.json(
      {
        error: {
          message: `Invalid ID: \`${rawId}\`. Please provide a valid ${entityName} ID, which should be a number.`,
        },
      },
      { status: 400 }
    );
  }

  // Retrieve the request body
  let body;
  try {
    body = await request.json();
  } catch (error) {
    return Response.json(
      { error: { message: "Invalid request body" } },
      { status: 400 }
    );
  }

  // Validate the request body using the Zod schema
  const parsed = zodSchema.partial().omit({ id: true }).safeParse(body); // Note: Zod parsing will strip any additional properties. We could

  if (!parsed.success) {
    return Response.json(
      { error: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  // Perform the update
  try {
    const result = await db
      .update(table)
      .set(parsed.data)
      .where(eq(table.id, parsedId))
      .returning();

    return Response.json(result[0]);
  } catch (error) {
    return Response.json(
      { error: { message: "Error updating character" } },
      { status: 500 }
    );
  }
}
